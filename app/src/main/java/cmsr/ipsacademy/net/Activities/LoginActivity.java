package cmsr.ipsacademy.net.Activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import cmsr.ipsacademy.net.R;
import cmsr.ipsacademy.net.Util.SharedPreference;
import cmsr.ipsacademy.net.api.controller;
import cmsr.ipsacademy.net.api.responsemodel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity
{
    private EditText editTextComputerCode, editTextPassword;
    private ImageView loginButton;
    private SharedPreference sharedPreference;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sharedPreference = new SharedPreference(this);

        editTextComputerCode=(EditText)findViewById(R.id.edit_text_computer_code_login);
        editTextPassword=(EditText)findViewById(R.id.edit_text_password_login);
        loginButton=(ImageView)findViewById(R.id.login_button_image_submit);

        checkuserexistence();

        loginButton.setOnClickListener(view -> processlogin());

    }

    void processlogin()
    {
        String computer_code=editTextComputerCode.getText().toString().trim();
        String password=editTextPassword.getText().toString().trim();

        Call<responsemodel> call= controller
                .getInstance()
                .getapi()
                .verifyuser(computer_code,password);

        call.enqueue(new Callback<responsemodel>() {
            @Override
            public void onResponse(Call<responsemodel> call, Response<responsemodel> response) {
                responsemodel obj=response.body();
                String output=obj.getMessage();
                String is_student = obj.getIs_student();
                if(output.equals("failed"))
                {
                    editTextComputerCode.setText("");
                    editTextPassword.setText("");
                    Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                }
                if(output.equals("exist") && is_student.equals("yes"))
                {
                    Toast.makeText(getApplicationContext(), "Login Sucessfull", Toast.LENGTH_SHORT).show();
                    try {
                        sharedPreference.save("computer_code", editTextComputerCode.getText().toString().trim());
                    }catch (Exception e){
                        Log.e("e", e.toString());
                    }
                    startActivity(new Intent(getApplicationContext(),UserActivity.class));
                    finish();
                }
                if (output.equals("exist") && is_student.equals("no")){
                    Toast.makeText(getApplicationContext(), "Login Sucessfull", Toast.LENGTH_SHORT).show();
                    try {
                        sharedPreference.save("computer_code", editTextComputerCode.getText().toString().trim());
                    }catch (Exception e){
                        Log.e("e", e.toString());
                    }
                    startActivity(new Intent(getApplicationContext(),MainActivity.class));
                    finish();
                }
            }

            @Override
            public void onFailure(Call<responsemodel> call, Throwable t) {
                Log.i("failedLogin", t.toString());
            }
        });

    }

    void checkuserexistence()
    {
        try {
            if(sharedPreference.getValueString("computer_code")!=null)
                startActivity(new Intent(getApplicationContext(),UserActivity.class));
            else {
                Toast.makeText(getApplicationContext(), "Please Login", Toast.LENGTH_SHORT).show();
            }
        }catch (Exception e){
            Log.e("e", e.toString());
        }

    }
}
