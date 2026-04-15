const express = require("express");
const { fetchTouchStayGuideResponse } = require("./util");
const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const pageUrl = `https://guide.touchstay.com/guest/${id}/`;
  try {
    const responseData = await fetchTouchStayGuideResponse(pageUrl);
    console.log("res", responseData);

    return res.status(200).json({responseData});
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Error fetching data for id ${id}: ${(error)?.message}`,
      error: error?.message,
    });
  }
});



module.exports={userRouter}
