import express from "express"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user._id },
    }).select("username")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error: error.message })
  }
})

router.get("/recommendations", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends")
    const friendIds = user.friends.map((friend) => friend._id)
    const recommendations = await User.aggregate([
      { $match: { _id: { $nin: [...friendIds, req.user._id] } } },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "mutualFriends",
        },
      },
      {
        $project: {
          username: 1,
          mutualFriendsCount: {
            $size: {
              $setIntersection: ["$mutualFriends._id", friendIds],
            },
          },
          commonInterests: {
            $size: {
              $setIntersection: ["$interests", user.interests],
            },
          },
        },
      },
      { $sort: { mutualFriendsCount: -1, commonInterests: -1 } },
      { $limit: 5 },
    ])
    res.json(recommendations)
  } catch (error) {
    res.status(500).json({ message: "Error getting recommendations", error: error.message })
  }
})

export default router

