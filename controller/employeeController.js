const Employee = require("../schema/employeeSchema");

const fetchEmployees = async (req, res) => {
  try {
    const filterObj = {};
    const sort = { name: 1 };
    if (!req.query.startDate && !req.query.endDate && !req.query.sort) {
      const employees = await Employee.find();
      if (employees) {
        res.status(200).json({ success: true, result: employees });
        return;
      } else {
        res.status(400).json({ success: false, message: "Error While Fetching Details" });
        return;
      }
    }
    if (req.query.startDate) {
      filterObj.startDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filterObj.endDate = new Date(req.query.endDate);
    }
    if (req.query.sort && req.query.sort === "DESC") {
      sort.name = -1;
    }
    const employees = await Employee.find({ ...filterObj }).sort({ ...sort });
    if (employees) {
      res.status(200).json({ success: true, result: employees });
      return;
    } else {
      res.status(400).json({ success: false, message: "Error While Fetching Details" });
      return;
    }
  } catch (error) {
    let message = "Something Went Wrong";
    res.status(400).json({ success: false, message });
    return;
  }
};

module.exports={
    fetchEmployees,
}