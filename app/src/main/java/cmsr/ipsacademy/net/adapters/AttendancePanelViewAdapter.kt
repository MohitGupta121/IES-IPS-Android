package cmsr.ipsacademy.net.adapters

import android.content.Context
import android.util.Log
import androidx.recyclerview.widget.RecyclerView
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import cmsr.ipsacademy.net.R
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectDetailsModel
import cmsr.ipsacademy.net.activities.models.faculty.subjects.FacultySubjectDetailsModelItem
import kotlinx.android.synthetic.main.attendance_panel_table_list.view.*

class AttendancePanelViewAdapter(val context: Context): RecyclerView.Adapter<AttendancePanelViewAdapter.RowViewHolder>() {


    lateinit var myList: List<FacultySubjectDetailsModelItem>


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RowViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.attendance_panel_table_list, parent, false)
        return RowViewHolder(itemView)
    }

    private fun setHeaderBg(view: View) {
        view.setBackgroundResource(R.drawable.table_header_cell_bg)
    }

    private fun setContentBg(view: View) {
        view.setBackgroundResource(R.drawable.table_content_cell_bg)
    }

    override fun onBindViewHolder(holder: RowViewHolder, position: Int) {
        val rowPos = holder.adapterPosition

            val modal = myList[position]

            holder.itemView.apply {
                setContentBg(txtSNo)
                setContentBg(txtBatch)
                setContentBg(txtDepartment)
                setContentBg(txtSubject)
                setContentBg(txtSubjectCode)
                setContentBg(btnAction)

                txtSNo.text = (holder.adapterPosition +1).toString()
                txtBatch.text = modal.batch
                txtDepartment.text = modal.department
                txtSubject.text = modal.subject_name
                txtSubjectCode.text = modal.university_sub_code
            }
    }

    fun setData(newList: List<FacultySubjectDetailsModelItem>){
        myList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int {

        return myList.size // one more to add header row
    }

    inner class RowViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)
}