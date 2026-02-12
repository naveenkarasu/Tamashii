# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep Tamashii blocker plugin classes (called via reflection by Tauri)
-keep class com.tamashii.app.blocker.** { *; }
-keep class com.tamashii.app.blocker.BlockerPlugin { *; }
-keep class com.tamashii.app.blocker.DnsVpnService { *; }
-keep class com.tamashii.app.blocker.AppBlockerService { *; }
-keep class com.tamashii.app.blocker.BlockedActivity { *; }
-keep class com.tamashii.app.blocker.BootReceiver { *; }

# Keep InvokeArg classes used for Gson deserialization
-keepclassmembers class * {
    @app.tauri.annotation.InvokeArg *;
}
