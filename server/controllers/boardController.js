import Board from "../models/Board.js"
import List from "../models/List.js"
import Card from "../models/Card.js"

export const createBoard = async (req, res) => {
  try {
    const { title, description, color } = req.body

    const board = new Board({
      title,
      description,
      color,
      owner: req.userId,
      members: [req.userId],
    })

    const savedBoard = await board.save()
    await savedBoard.populate("owner members")

    res.status(201).json(savedBoard)
  } catch (error) {
    res.status(500).json({ message: "Failed to create board", error: error.message })
  }
}

export const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.userId }, { members: req.userId }],
    }).populate("owner members lists")

    res.json(boards)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch boards", error: error.message })
  }
}

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate("owner members")

    if (!board) {
      return res.status(404).json({ message: "Board not found" })
    }

    // Populate lists from List model to ensure all lists are included
    const lists = await List.find({ board: req.params.id }).populate({
      path: "cards",
      populate: "assignees",
    }).sort({ position: 1 })

    board.lists = lists

    res.json(board)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch board", error: error.message })
  }
}

export const updateBoard = async (req, res) => {
  try {
    const { title, description, color } = req.body
    const board = await Board.findByIdAndUpdate(req.params.id, { title, description, color }, { new: true }).populate(
      "owner members lists",
    )

    res.json(board)
  } catch (error) {
    res.status(500).json({ message: "Failed to update board", error: error.message })
  }
}

export const addMember = async (req, res) => {
  try {
    const { email } = req.body
    const board = await Board.findById(req.params.id)

    if (!board) {
      return res.status(404).json({ message: "Board not found" })
    }

    // Import User to find by email
    const User = (await import("../models/User.js")).default
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!board.members.includes(user._id)) {
      board.members.push(user._id)
      await board.save()
    }

    await board.populate("owner members")
    res.json(board)
  } catch (error) {
    res.status(500).json({ message: "Failed to add member", error: error.message })
  }
}

export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)

    if (!board) {
      return res.status(404).json({ message: "Board not found" })
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    await List.deleteMany({ board: req.params.id })
    await Card.deleteMany({ board: req.params.id })
    await Board.findByIdAndDelete(req.params.id)

    res.json({ message: "Board deleted" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete board", error: error.message })
  }
}
