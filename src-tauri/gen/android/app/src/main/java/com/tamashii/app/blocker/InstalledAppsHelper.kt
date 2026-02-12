package com.tamashii.app.blocker

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream

data class AppInfo(
    val packageName: String,
    val appName: String,
    val iconBase64: String
)

object InstalledAppsHelper {
    fun getInstalledApps(context: Context): List<AppInfo> {
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        val resolveInfos = pm.queryIntentActivities(mainIntent, 0)
        val selfPackage = context.packageName

        return resolveInfos
            .filter { it.activityInfo.packageName != selfPackage }
            .map { ri ->
                val packageName = ri.activityInfo.packageName
                val appName = ri.loadLabel(pm).toString()
                val icon = ri.loadIcon(pm)
                val iconBase64 = drawableToBase64(icon)
                AppInfo(packageName, appName, iconBase64)
            }
            .sortedBy { it.appName.lowercase() }
            .distinctBy { it.packageName }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        val bitmap = drawableToBitmap(drawable, 48)
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)
        val bytes = stream.toByteArray()
        return Base64.encodeToString(bytes, Base64.NO_WRAP)
    }

    private fun drawableToBitmap(drawable: Drawable, size: Int): Bitmap {
        if (drawable is BitmapDrawable && drawable.bitmap != null) {
            return Bitmap.createScaledBitmap(drawable.bitmap, size, size, true)
        }
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, size, size)
        drawable.draw(canvas)
        return bitmap
    }
}
