package cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import cmsr.ipsacademy.net.R


class ItemAdapter(private val mList: List<DataModel>) :
    RecyclerView.Adapter<ItemAdapter.ItemViewHolder>() {
    private var list: List<DataOfStudent> = ArrayList()
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.each_item, parent, false)
        return ItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        val model = mList[position]
        holder.mTextView.text = model.getItemText()
        val isExpandable = model.isExpandable()
        holder.expandableLayout.visibility = if (isExpandable) View.VISIBLE else View.GONE
        if (isExpandable) {
            holder.mArrowImage.setImageResource(R.drawable.arrow_up)
        } else {
            holder.mArrowImage.setImageResource(R.drawable.arrow_down)
        }
        holder.nestedRecyclerView.layoutManager = LinearLayoutManager(holder.itemView.context)
        holder.nestedRecyclerView.setHasFixedSize(true)
        holder.linearLayout.setOnClickListener {
            model.setExpandable(!model.isExpandable())
            list = model.getNestedList()!!
            notifyItemChanged(holder.adapterPosition)
        }
        val adapter = NestedAdapter(list)
        holder.nestedRecyclerView.adapter = adapter
    }

    override fun getItemCount(): Int {
        return mList.size
    }

    inner class ItemViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val linearLayout: LinearLayout
        val expandableLayout: RelativeLayout
        val mTextView: TextView
        val mArrowImage: ImageView
        val nestedRecyclerView: RecyclerView

        init {
            linearLayout = itemView.findViewById(R.id.linear_layout)
            expandableLayout = itemView.findViewById(R.id.expandable_layout)
            mTextView = itemView.findViewById(R.id.day)
            mArrowImage = itemView.findViewById(R.id.arro_imageview)
            nestedRecyclerView = itemView.findViewById(R.id.child_rv)
        }
    }
}