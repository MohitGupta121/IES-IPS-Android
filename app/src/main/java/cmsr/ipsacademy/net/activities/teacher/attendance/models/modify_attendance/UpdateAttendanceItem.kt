package cmsr.ipsacademy.net.activities.teacher.attendance.models.modify_attendance

data class UpdateAttendanceItem(
    val attend: String,
    val attend_info: String,
    val attend_record_id: String,
    val name: String,
    val student_computer_code: String,
    val uno: String,
    var isSelected: Boolean
)