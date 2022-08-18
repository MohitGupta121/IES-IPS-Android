package cmsr.ipsacademy.net.activities.teacher.attendance.adapters

import android.content.Context
import androidx.recyclerview.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.CheckBox
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.teacher.attendance.TakeAttendanceFragment
import cmsr.ipsacademy.net.activities.teacher.attendance.models.students_by_batch_id.StudentByBatchIdItem
import kotlinx.android.synthetic.main.attendance_panel_table_list.view.student_name
import kotlinx.android.synthetic.main.attendance_student_table_list.view.*

class TakeAttendanceStudentsListAdapter(
    val context: Context,
    val takeAttendanceFragment: TakeAttendanceFragment
) :
    RecyclerView.Adapter<TakeAttendanceStudentsListAdapter.RowViewHolder>() {

    var selectAllStudent: Boolean = false

    private lateinit var myList: List<StudentByBatchIdItem>
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
            student_name.text = modal.student_name
            student_enroll_number.text = modal.enrollment_no
            student_lab_group.text = modal.lab_group_name
        }

        holder.itemView.check_box.isChecked = modal.isSelected

        if (selectAllStudent) {
            modal.isSelected = true
            holder.itemView.check_box.isChecked = true

        } else {
            modal.isSelected = false
            holder.itemView.check_box.isChecked = false
        }

        holder.itemView.check_box.setOnClickListener {

            val attendCheckBox = it as CheckBox
            val attendStudent = myList[holder.adapterPosition].computer_code

            if (attendCheckBox.isChecked) {
                modal.isSelected = true
                takeAttendanceFragment.presentStudentList.add(attendStudent)
            } else if (!attendCheckBox.isChecked) {
                modal.isSelected = false
                takeAttendanceFragment.presentStudentList.remove(attendStudent)
            }

//           mlistener.onItemClick(holder.adapterPosition)
        }

    }

    fun setData(newList: List<StudentByBatchIdItem>) {
        myList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {
        return myList.size
    }

    inner class RowViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}