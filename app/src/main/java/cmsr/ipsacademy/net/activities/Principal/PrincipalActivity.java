package cmsr.ipsacademy.net.activities.Principal;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.material.navigation.NavigationView;

import cmsr.ipsacademy.net.R;

public class PrincipalActivity extends AppCompatActivity {

    String[] duty = {"Counselling","Set Category Criteria","view Students"};
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_principal);

        NavigationView navigationView = findViewById (R.id.navigation_menu);

        Spinner spinner = (Spinner) navigationView.getMenu().findItem(R.id.navigation_drawer_item3).getActionView();
        spinner.setAdapter(new ArrayAdapter<String>(this, R.layout.drop_down,duty));
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                Toast.makeText(PrincipalActivity.this,"hii", Toast.LENGTH_SHORT).show();
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });


    }
}