package cmsr.ipsacademy.net.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.api.apiset
import cmsr.ipsacademy.net.api.controller
import cmsr.ipsacademy.net.Util.SharedPreference

import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
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

        loginButton!!.setOnClickListener(View.OnClickListener {
            processLogin()
        })

    }

    private fun processLogin() {
        val computer_code = editTextComputerCode!!.text.toString().trim()
        val password = editTextPassword!!.text.toString().trim()

        val userApi = controller.getInstance().create(apiset::class.java)

        userApi.verifyuser(computer_code, password)
            .enqueue(object : Callback<responsemodel> {
                override fun onResponse(
                    call: Call<responsemodel>,
                    response: Response<responsemodel>
                ) {
                    if (response.body()?.message.equals("failed")) {
                        editTextComputerCode!!.setText("")
                        editTextPassword!!.setText("")
                        Toast.makeText(
                            applicationContext,
                            "Invalid Computer Code or Password",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    if (response.body()?.message.equals("exist") && response.body()?.is_student.equals(
                            "yes"
                        )
                    ) {
                        Toast.makeText(applicationContext, "Login Sucessfull", Toast.LENGTH_SHORT)
                            .show()
                        sharedPreference?.save("computer_code", computer_code)
                        sharedPreference?.save("role", "student")
                        startActivity(Intent(applicationContext, Student::class.java))
                    }
                    if (response.body()?.message.equals("exist") && response.body()?.is_student.equals(
                            "no"
                        )
                    ) {
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

                override fun onFailure(call: Call<responsemodel>, t: Throwable) {
                    Toast.makeText(applicationContext, t.message, Toast.LENGTH_SHORT).show()
                }

            })
    }

    private fun checkUserExistence() {
        if (sharedPreference?.getValueString("computer_code") != null) {
            if (sharedPreference?.getValueString("role").equals("student")) {
                startActivity(Intent(applicationContext, Student::class.java))
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