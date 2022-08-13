package cmsr.ipsacademy.net.activities.teacher.attendence.models.modify_attendance

data class ModifyAttendanceItem(
    val attend_info: String,
    val batch: String,
    val batch_id: String,
    val date: String,
    val faculty_computer_code: String,
    val ip: String,
    val lab_group: String,
    val lecture: String,
    val lecture_type: String,
    val remark: String,
    val subject_name: String,
    val time_slot: String,
    val time_slot_id: String,
    val time_stamp: String,
    val topic: String,
    val topic_name: String,
    val total_present: String
)