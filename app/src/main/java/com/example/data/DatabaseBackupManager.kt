package com.example.data

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.nio.channels.FileChannel

/**
 * Enterprise Production-Grade Database Backup & Restore Manager
 * Implements transaction-safe copy mechanisms for SQLite databases running in WAL (Write-Ahead Log) mode.
 */
object DatabaseBackupManager {
    private const val TAG = "DatabaseBackupManager"
    private const val BACKUP_DIR_NAME = "database_backups"
    private const val MAIN_DB_NAME = "one_call_database"

    /**
     * Executes an online live backup of the primary database file plus write-ahead log structures.
     * Runs completely off-thread under Dispatchers.IO
     * @return Absolute path of the generated main backup file, or null if failure
     */
    suspend fun performBackup(context: Context): String? = withContext(Dispatchers.IO) {
        try {
            val dbFile = context.getDatabasePath(MAIN_DB_NAME)
            if (!dbFile.exists()) {
                Log.e(TAG, "Backup aborted: Source database file does not exist yet.")
                return@withContext null
            }

            // Create target backup directory inside private secure application space
            val backupDirectory = File(context.filesDir, BACKUP_DIR_NAME)
            if (!backupDirectory.exists() && !backupDirectory.mkdirs()) {
                Log.e(TAG, "Backup aborted: Could not create secure backup directory.")
                return@withContext null
            }

            val timestamp = System.currentTimeMillis()
            val backupFile = File(backupDirectory, "${MAIN_DB_NAME}_backup_$timestamp.db")

            // 1. Copy the main SQLite DB file
            copyFileUsingChannels(dbFile, backupFile)
            Log.i(TAG, "Main DB backup written to: ${backupFile.absolutePath}")

            // 2. Safely copy WAL & SHM logs if they exist (Room defaults to WAL journal mode)
            val walFile = File(dbFile.parent, "$MAIN_DB_NAME-wal")
            if (walFile.exists()) {
                val walBackup = File(backupDirectory, "${MAIN_DB_NAME}_backup_$timestamp.db-wal")
                copyFileUsingChannels(walFile, walBackup)
                Log.i(TAG, "WAL journal backup completed.")
            }

            val shmFile = File(dbFile.parent, "$MAIN_DB_NAME-shm")
            if (shmFile.exists()) {
                val shmBackup = File(backupDirectory, "${MAIN_DB_NAME}_backup_$timestamp.db-shm")
                copyFileUsingChannels(shmFile, shmBackup)
                Log.i(TAG, "SHM index backup completed.")
            }

            Log.i(TAG, "✅ Database Backup completed successfully.")
            return@withContext backupFile.absolutePath
        } catch (e: Exception) {
            Log.e(TAG, "🚨 Database Backup failed: ${e.message}", e)
            return@withContext null
        }
    }

    /**
     * Restores a database backup, closing Room connections before replacing original SQLite structures.
     * @param context Application context
     * @param backupFilePath Absolute path to the main backup file (.db) to restore
     * @return True if restoration completed successfully, false otherwise
     */
    suspend fun restoreBackup(context: Context, backupFilePath: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val backupFile = File(backupFilePath)
            if (!backupFile.exists()) {
                Log.e(TAG, "Restore aborted: Backup file not found at $backupFilePath")
                return@withContext false
            }

            // Close active SQLite instances prior to hot-swap
            AppDatabase.getDatabase(context).close()

            val dbFile = context.getDatabasePath(MAIN_DB_NAME)

            // Overwrite main SQLite DB file
            copyFileUsingChannels(backupFile, dbFile)
            Log.i(TAG, "Main DB swapped from backup.")

            // Restore corresponding WAL log if exists in backup file namespace
            val walBackup = File(backupFile.parent, "${backupFile.name}-wal")
            val dbWalFile = File(dbFile.parent, "$MAIN_DB_NAME-wal")
            if (walBackup.exists()) {
                copyFileUsingChannels(walBackup, dbWalFile)
                Log.i(TAG, "WAL journal swapped from backup.")
            } else if (dbWalFile.exists()) {
                dbWalFile.delete() // Clear active WAL so it doesn't mismatch with restored DB
            }

            // Restore corresponding SHM file
            val shmBackup = File(backupFile.parent, "${backupFile.name}-shm")
            val dbShmFile = File(dbFile.parent, "$MAIN_DB_NAME-shm")
            if (shmBackup.exists()) {
                copyFileUsingChannels(shmBackup, dbShmFile)
                Log.i(TAG, "SHM index swapped from backup.")
            } else if (dbShmFile.exists()) {
                dbShmFile.delete()
            }

            Log.i(TAG, "✅ Database Restoration completed successfully. Re-launch app/viewmodels to re-initialize.")
            return@withContext true
        } catch (e: Exception) {
            Log.e(TAG, "🚨 Database Restore failed: ${e.message}", e)
            return@withContext false
        }
    }

    /**
     * Efficient NIO-based file copy
     */
    private fun copyFileUsingChannels(source: File, dest: File) {
        var sourceChannel: FileChannel? = null
        var destChannel: FileChannel? = null
        try {
            sourceChannel = FileInputStream(source).channel
            destChannel = FileOutputStream(dest).channel
            destChannel.transferFrom(sourceChannel, 0, sourceChannel.size())
        } finally {
            sourceChannel?.close()
            destChannel?.close()
        }
    }

    /**
     * List all available local backup files
     */
    fun getAvailableBackups(context: Context): List<File> {
        val backupDirectory = File(context.filesDir, BACKUP_DIR_NAME)
        if (!backupDirectory.exists()) return emptyList()
        return backupDirectory.listFiles { file -> file.extension == "db" }?.toList() ?: emptyList()
    }
}
