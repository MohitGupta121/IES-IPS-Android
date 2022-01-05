package cmsr.ipsacademy.net.Activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.EditText
import android.widget.TextView
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.Util.SharedPreference

class UserActivity : AppCompatActivity() {

    lateinit var userName: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        val sharedPreference: SharedPreference = SharedPreference(this)

        userName = findViewById(R.id.user_name)

        if (sharedPreference.getValueString("role") != null)
            userName.setText(sharedPreference.getValueString("role"))

    }
}