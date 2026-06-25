# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Capacitor
-keep class com.getcapacitor.** { *; }
-keep class capacitor.android.plugins.** { *; }
-dontwarn capacitor.android.plugins.**

# WebView JavaScript Interface
-keepclassmembers class com.onecall.homesolutions.MainActivity {
    public *;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# OkHttp and Okio
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }

# Keep serialized fields
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

