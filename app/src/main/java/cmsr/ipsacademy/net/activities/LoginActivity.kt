package cmsr.ipsacademy.net.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.KeyEvent
import android.view.View
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.Util.SharedPreference

import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import cmsr.ipsacademy.net.activities.models.LoginModel
import cmsr.ipsacademy.net.api.responsemodel
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private var editTextComputerCode: EditText? = null
    private var editTextPassword: EditText? = null
    private var loginButton: ImageView? = null
    private var sharedPreference: SharedPreference? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        sharedPreference = SharedPreference(this)

        editTextComputerCode = findViewById(R.id.edit_text_computer_code_login)
        editTextPassword = findViewById(R.id.edit_text_password_login)
        loginButton = findViewById(R.id.login_button_image_submit)

        checkUserExistence()

        editTextPassword?.setOnKeyListener(View.OnKeyListener { v, keyCode, event ->
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.action == KeyEvent.ACTION_UP) {
                processLogin()
                return@OnKeyListener true
            }
            false
        })

        loginButton!!.setOnClickListener(View.OnClickListener {
            processLogin()
        })

    }

    private fun processLogin() {
        val computer_code = editTextComputerCode!!.text.toString().trim()
        val password = editTextPassword!!.text.toString().trim()

        val userApi = controller.getInstance().create(apiset::class.java)

        userApi.verifyuser(computer_code, password)
            .enqueue(object : Callback<LoginModel> {
                override fun onResponse(call: Call<LoginModel>, response: Response<LoginModel>) {

                    Log.e("Response", response.body().toString())

                    if (response.body()?.student_info?.isEmpty() == true) {
                        editTextComputerCode!!.setText("")
                        editTextPassword!!.setText("")
                        Toast.makeText(
                            applicationContext,
                            "Invalid Computer Code or Password",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    if (response.body()?.student_info?.isEmpty() == false && response.body()!!.student_info[0].is_student == "1") {
                        Toast.makeText(applicationContext, "Login Sucessfull", Toast.LENGTH_SHORT)
                            .show()
                        sharedPreference?.save("computer_code", computer_code)
                        sharedPreference?.save("role", "student")
                        startActivity(Intent(applicationContext, Student::class.java))
                    }
                    if (response.body()?.student_info?.isEmpty() == false && response.body()!!.student_info[0].is_student == "0") {

                        Toast.makeText(applicationContext, "Login Sucessfull", Toast.LENGTH_SHORT)
                            .show()

                        sharedPreference?.save("computer_code", computer_code)

                        if (sharedPreference?.getValueString("computer_code").equals("2083")) {
                            sharedPreference?.save("role", "HOD")

                            sharedPreference?.getValueString("computer_code")
                                ?.let { Log.e("ROLESAvED", it) }
                            sharedPreference?.getValueString("role")?.let { Log.e("role", it) }
                        } else if (sharedPreference?.getValueString("computer_code")
                                .equals("1") || sharedPreference?.getValueString("computer_code")
                                .equals("2") || sharedPreference?.getValueString("computer_code")
                                .equals("3")
                        ) {
                            sharedPreference?.save("role", "Principal")

                            sharedPreference?.getValueString("computer_code")
                                ?.let { Log.e("ROLESAvED", it) }
                            sharedPreference?.getValueString("role")?.let { Log.e("role", it) }
                        } else {
                            sharedPreference?.save("role", "Teacher")
                            sharedPreference?.getValueString("role")?.let { Log.i("role", it) }

                        }

                        startActivity(Intent(applicationContext, UserActivity::class.java))

                    }

                }

                override fun onFailure(call: Call<LoginModel>, t: Throwable) {
                    Log.e("Response", t.message.toString())
                }
            })

    }

    private fun checkUserExistence() {
        if (sharedPreference?.getValueString("computer_code") != null) {
            if (sharedPreference?.getValueString("role").equals("student")) {
                startActivity(Intent(applicationContext, MainActivity::class.java))
            } else if (sharedPreference?.getValueString("role").equals("HOD")) {
                startActivity(Intent(applicationContext, UserActivity::class.java))
            } else if (sharedPreference?.getValueString("role").equals("Teacher")) {
                startActivity(Intent(applicationContext, UserActivity::class.java))
            } else if (sharedPreference?.getValueString("role").equals("Principal")) {
                startActivity(Intent(applicationContext, UserActivity::class.java))
            }

        } else {
            Toast.makeText(applicationContext, "Please Login", Toast.LENGTH_SHORT).show()
        }
    }

}