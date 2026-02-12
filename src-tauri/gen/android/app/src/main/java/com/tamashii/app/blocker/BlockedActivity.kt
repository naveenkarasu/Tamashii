package com.tamashii.app.blocker

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class BlockedActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(buildLayout())
    }

    private fun buildLayout(): View {
        val dp = { value: Int ->
            TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                value.toFloat(),
                resources.displayMetrics
            ).toInt()
        }

        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0D0D0D"))
            setPadding(dp(32), dp(64), dp(32), dp(64))

            // Shield icon (Unicode)
            addView(TextView(this@BlockedActivity).apply {
                text = "\uD83D\uDEE1\uFE0F"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 72f)
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(24) }
            })

            // Title
            addView(TextView(this@BlockedActivity).apply {
                text = "APP BLOCKED"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 28f)
                setTextColor(Color.parseColor("#FF4444"))
                typeface = Typeface.DEFAULT_BOLD
                gravity = Gravity.CENTER
                letterSpacing = 0.15f
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(16) }
            })

            // Message
            addView(TextView(this@BlockedActivity).apply {
                text = "This app is blocked by Tamashii.\nStay focused — you've got this."
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
                setTextColor(Color.parseColor("#888888"))
                gravity = Gravity.CENTER
                lineSpacingMultiplier = 1.4f
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { bottomMargin = dp(48) }
            })

            // Go Home button
            addView(Button(this@BlockedActivity).apply {
                text = "GO HOME"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
                setTextColor(Color.WHITE)
                typeface = Typeface.DEFAULT_BOLD
                letterSpacing = 0.1f
                setBackgroundColor(Color.parseColor("#FF4444"))
                setPadding(dp(32), dp(16), dp(32), dp(16))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                )
                setOnClickListener { goHome() }
            })
        }
    }

    override fun onBackPressed() {
        goHome()
    }

    private fun goHome() {
        val homeIntent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        startActivity(homeIntent)
        finish()
    }
}
