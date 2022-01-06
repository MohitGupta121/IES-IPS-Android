package cmsr.ipsacademy.net.Activities;

import static cmsr.ipsacademy.net.Constants.TOPIC;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.firebase.messaging.FirebaseMessaging;

import cmsr.ipsacademy.net.R;
import cmsr.ipsacademy.net.api.FirebaseApiUtil;
import cmsr.ipsacademy.net.model.NotificationData;
import cmsr.ipsacademy.net.model.PushNotification;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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

        FirebaseMessaging.getInstance().subscribeToTopic(TOPIC);


        notificationSendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String title = notificationTitle.getText().toString();
                String message = notificationMessage.getText().toString();

                if (!title.isEmpty() && !message.isEmpty()) {
                    PushNotification pushNotification = new PushNotification(new NotificationData(title, message), TOPIC);
                    sendNotification(pushNotification);
                }
            }
        });

    }

    private void sendNotification(PushNotification pushNotification) {
        FirebaseApiUtil.getClient().sendNotification(pushNotification).enqueue(new Callback<PushNotification>() {
            @Override
            public void onResponse(Call<PushNotification> call, Response<PushNotification> response) {
                if (response.isSuccessful())
                    Toast.makeText(UserActivity.this, "Sucess", Toast.LENGTH_SHORT).show();
                Toast.makeText(UserActivity.this, "Error" + response.errorBody(), Toast.LENGTH_SHORT).show();
                Log.e("not", String.valueOf(response.errorBody()));
            }

            @Override
            public void onFailure(Call<PushNotification> call, Throwable t) {
                Toast.makeText(UserActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();

            }
        });
    }


}
