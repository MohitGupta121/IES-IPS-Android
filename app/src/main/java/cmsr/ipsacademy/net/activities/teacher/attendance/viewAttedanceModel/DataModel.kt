package cmsr.ipsacademy.net.activities.teacher.attendance.viewAttedanceModel

class DataModel(nestedList1: MutableList<DataOfStudent>, day: String,time:String  ) {
    private var nestedList: List<DataOfStudent>? = nestedList1
    private var itemText: String? = day
    private var itemText2: String? = time
    private var isExpandable = false



    fun setExpandable(expandable: Boolean) {
        isExpandable = expandable
    }

    fun getNestedList(): List<DataOfStudent>? {
        return nestedList
    }

    fun getItemText(): String? {
        return itemText
    }
    fun getItemText2(): String? {
        return itemText2
    }

    fun isExpandable(): Boolean {
        return isExpandable
    }
}