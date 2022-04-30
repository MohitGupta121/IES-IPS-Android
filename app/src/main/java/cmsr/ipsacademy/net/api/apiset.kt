package cmsr.ipsacademy.net.api

import cmsr.ipsacademy.net.activities.models.LoginModel
import cmsr.ipsacademy.net.activities.models.faculty.FacultyInfoModel
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectsDetailsModel
import cmsr.ipsacademy.net.activities.models.student.StudentInfoModel
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import retrofit2.Call
import retrofit2.http.Field

interface apiset {

    @FormUrlEncoded
    @POST("login_android.php")
    fun verifyuser(
        @Field("computer_code") computer_code: String,
        @Field("password") password: String
    ): Call<LoginModel>

    @FormUrlEncoded
    @POST("student_college_info.php")
    fun getStudentDetails(
        @Field("computer_code") computer_code: String
    ): Call<StudentInfoModel>

    @FormUrlEncoded
    @POST("faculty_info.php")
    fun getFacultyDetails(
        @Field("computer_code") computer_code: String
    ): Call<FacultyInfoModel>

    @FormUrlEncoded
    @POST("faculty_info_attendance.php")
    fun getFacultySubjectsDetails(
        @Field("computer_code") computer_code: String
    ): Call<FacultySubjectsDetailsModel>

}