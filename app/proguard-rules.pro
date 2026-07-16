# Add project specific ProGuard rules here.
# For more details, see: http://developer.android.com/guide/developing/tools/proguard.html

# --- Debugging Information ---
# Keep line numbers and source file names for production crash logs (Crashlytics)
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod

# --- Android Platform Rules ---
-keep class android.support.v4.app.** { *; }
-keep interface android.support.v4.app.** { *; }
-keep class androidx.core.** { *; }
-keep interface androidx.core.** { *; }

# --- Kotlin Coroutines ---
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembernames class kotlinx.coroutines.** {
    volatile <fields>;
}

# --- Room Database Proguard Rules ---
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# --- Retrofit Proguard Rules ---
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepclassmembers class * {
    @retrofit2.http.** <methods>;
}
-dontwarn retrofit2.**

# --- OkHttp Proguard Rules ---
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**

# --- Moshi Proguard Rules ---
-keep class com.squareup.moshi.** { *; }
-dontwarn com.squareup.moshi.**
# Keep annotated classes and generated adapters
-keep @com.squareup.moshi.JsonClass class *
-keep class *JsonAdapter {
    public <init>(...);
}

# --- Jetpack Compose ---
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**

# --- App Domain Specific Rules ---
-keep class com.example.data.** { *; }
-keep class com.example.ui.** { *; }
