package cmsr.ipsacademy.net.activities.teacher.attendance.adapters

import android.content.Context
import androidx.recyclerview.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.fragments.TakeAttendanceFragment
import cmsr.ipsacademy.net.activities.teacher.attendance.fragments.ViewAttendanceUpdate
import cmsr.ipsacademy.net.activities.teacher.attendance.models.modify_attendance.UpdateAttendanceItem
import cmsr.ipsacademy.net.activities.teacher.attendance.models.students_by_batch_id.StudentByBatchIdItem
import kotlinx.android.synthetic.main.attendance_panel_table_list.view.student_name
import kotlinx.android.synthetic.main.attendance_student_table_list.view.*

class UpdateAttendanceStudentsListAdapter(
    val context: Context, private val updateAttendanceFragment: ViewAttendanceUpdate) :
    RecyclerView.Adapter<UpdateAttendanceStudentsListAdapter.RowViewHolder>() {

    var selectAllStudent: Boolean = false

    private lateinit var myList: List<UpdateAttendanceItem>
    private lateinit var mlistener: onItemClickListener

    interface onItemClickListener {
        fun onItemClick(position: Int)
    }

    fun setOnClickListener(listener: onItemClickListener) {
        mlistener = listener
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RowViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.attendance_student_table_list, parent, false)
        return RowViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: RowViewHolder, position: Int) {
        val rowPos = holder.adapterPosition

        val modal = myList[position]

        holder.itemView.apply {
//            student_name.text = (holder.adapterPosition + 1).toString()
            student_name.text = modal.name
            student_enroll_number.text = modal.uno
            student_lab_group.text = modal.student_computer_code
        }

        holder.itemView.check_box.isChecked = modal.isSelected

//        modal.isSelected = modal.attend.contentEquals("1")

        if (modal.attend.contentEquals("1") || modal.isSelected) {
            modal.isSelected = true
            holder.itemView.check_box.isChecked = true

        } else {
            modal.isSelected = false
            holder.itemView.check_box.isChecked = false
        }

        holder.itemView.check_box.setOnClickListener {

            val attendCheckBox = it as CheckBox
            val attendStudent = myList[holder.adapterPosition].student_computer_code

            if (attendCheckBox.isChecked) {
                modal.isSelected = true
                updateAttendanceFragment.presentStudentList.add(attendStudent)
                updateAttendanceFragment.absentStudentList.remove(attendStudent)
            } else if (!attendCheckBox.isChecked) {
                modal.isSelected = false
                updateAttendanceFragment.presentStudentList.remove(attendStudent)
                updateAttendanceFragment.absentStudentList.add(attendStudent)
            }

//           mlistener.onItemClick(holder.adapterPosition)
        }

    }

    fun setData(newList: List<UpdateAttendanceItem>) {
        myList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return myList.size
    }

    inner class RowViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}