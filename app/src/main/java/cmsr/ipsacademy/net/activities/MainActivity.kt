package cmsr.ipsacademy.net.activities


import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.Util.SharedPreference
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth

class MainActivity : AppCompatActivity() {

    private var inputEmail: EditText? = null
    private var inputPassword: EditText? = null
    private var userIdSpinner: Spinner? = null
    private var loginButton: Button? = null
    private var auth: FirebaseAuth? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val toolbar = findViewById<Toolbar>(R.id.toolBar)

        val navigationView = findViewById<NavigationView>(R.id.navigation_menu)
        navigationView.setItemIconTintList(null)
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawer)

        val actionBarDrawerToggle =
            ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open, R.string.close)
        drawerLayout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()


        val sharedPreference:SharedPreference = SharedPreference(this)

//        var token: String? = sharedPreference.getValueString("token")
//
//        if (token != null) {
//            Log.e("tt", token)
//            Toast.makeText(this, "token :" + token, Toast.LENGTH_SHORT).show()
//        }


//        val userIdList = resources.getStringArray(R.array.UsersId)
//
//        userIdSpinner = findViewById(R.id.choose_user)
//        if (userIdSpinner != null) {
//            val adapter = ArrayAdapter(
//                this,
//                android.R.layout.simple_spinner_item, userIdList
//            )
//            userIdSpinner!!.adapter = adapter
//
//            userIdSpinner!!.onItemSelectedListener = object :
//                AdapterView.OnItemSelectedListener {
//                override fun onItemSelected(
//                    parent: AdapterView<*>,
//                    view: View, position: Int, id: Long
//                ) {
//                    sharedPreference.save("role", userIdList.get(position))
//                    Toast.makeText(
//                        applicationContext,
//                        sharedPreference.getValueString("role"),
//                        Toast.LENGTH_SHORT
//                    )
//                        .show()
//                    sharedPreference.getValueString("role")?.let { Log.i("SharedTag", it) }
//                }
//
//                override fun onNothingSelected(parent: AdapterView<*>) {
//                    // write code to perform some action
//                }
//            }
//        }
//
//            inputEmail = findViewById(R.id.edit_email)
//            inputPassword = findViewById(R.id.edit_password)
//            loginButton = findViewById(R.id.button_login)
//
//            auth = FirebaseAuth.getInstance()
//
//            loginButton!!.setOnClickListener(View.OnClickListener {
//                val email = inputEmail!!.text.toString().trim()
//                val password = inputPassword!!.text.toString().trim()
//
//                if (TextUtils.isEmpty(email)) {
//                    Toast.makeText(
//                        applicationContext,
//                        "PLease Enter your E-Mail",
//                        Toast.LENGTH_SHORT
//                    )
//                        .show()
//                    return@OnClickListener
//                }
//                if (TextUtils.isEmpty(password)) {
//                    Toast.makeText(
//                        applicationContext,
//                        "PLease Enter your password",
//                        Toast.LENGTH_SHORT
//                    )
//                        .show()
//                    return@OnClickListener
//                }
//
//                auth!!.signInWithEmailAndPassword(email, password)
//                    .addOnCompleteListener(this, OnCompleteListener { task ->
//                        if (!task.isSuccessful) {
//                            if (password.length < 6) {
//                                inputPassword!!.setError(getString(R.string.minimum_password))
//                            } else {
//                                Toast.makeText(
//                                    this,
//                                    getString(R.string.auth_failed),
//                                    Toast.LENGTH_LONG
//                                )
//                                    .show()
//                            }
//                            Log.e("login", "Login Error", task.exception)
//                        } else{
//                            startActivity(Intent(this@MainActivity,UserActivity::class.java))
//                            finish()
//                        }
//                    })
//
//            })

    }
}