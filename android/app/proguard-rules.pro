# Color Dash ProGuard Rules

# --- React Native ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**

# --- Hermes Engine ---
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# --- Expo ---
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# --- Firebase ---
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Keep Firestore model classes
-keepclassmembers class * {
    @com.google.firebase.firestore.PropertyName *;
}

# --- OkHttp / Okio ---
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# --- General ---
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# --- Reanimated ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**
