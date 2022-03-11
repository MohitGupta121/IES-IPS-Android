package cmsr.ipsacademy.net.activities.Principal

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import cmsr.ipsacademy.net.R
import com.google.android.material.navigation.NavigationView
import android.widget.Spinner
import android.widget.ArrayAdapter
import android.widget.AdapterView.OnItemSelectedListener
import android.widget.AdapterView
import android.widget.Toast

class Principal : AppCompatActivity() {
    var duty = arrayOf("Counselling", "Set Category Criteria", "view Students")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_principal)
        val navigationView = findViewById<NavigationView>(R.id.navigation_menu)
        val spinner =
            navigationView.menu.findItem(R.id.navigation_drawer_item3).actionView as Spinner
        spinner.adapter = ArrayAdapter(this, R.layout.drop_down, duty)
        spinner.onItemSelectedListener = object : OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view: View,
                position: Int,
                id: Long
            ) {
                Toast.makeText(this@Principal, "hii", Toast.LENGTH_SHORT).show()
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {}
        }
    }
}