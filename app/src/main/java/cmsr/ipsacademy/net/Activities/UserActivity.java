package cmsr.ipsacademy.net.Activities;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.firebase.messaging.FirebaseMessaging;

import cmsr.ipsacademy.net.R;
import cmsr.ipsacademy.net.messaging.FcmNotificationsSender;

public class UserActivity extends AppCompatActivity {


    private EditText notificationTitle;
    private EditText notificationMessage;
    private Button notificationSendButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user);


        notificationTitle = findViewById(R.id.noti_title);
        notificationMessage = findViewById(R.id.noti_message);
        notificationSendButton = findViewById(R.id.noti_send);

        FirebaseMessaging.getInstance().subscribeToTopic("all");


        notificationSendButton.setOnClickListener(view -> {
            if (!notificationTitle.getText().toString().isEmpty() && !notificationMessage.getText().toString().isEmpty()){

                FcmNotificationsSender notificationsSender = new FcmNotificationsSender("/topics/all", notificationTitle.getText().toString(), notificationMessage.getText().toString(), getApplicationContext(), UserActivity.this);
                notificationsSender.SendNotifications();

            }else{
                Toast.makeText(this, "The noti details is Empty", Toast.LENGTH_SHORT).show();
            }
        });

    }


}
