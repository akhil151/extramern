import List from "../models/List.js"
import Card from "../models/Card.js"

export const createList = async (req, res) => {
  try {
    const { title, board, position } = req.body

    const list = new List({
      title,
      board,
      position: position || 0,
    })

    const savedList = await list.save()

    // Add the list to the board's lists array
    const Board = (await import("../models/Board.js")).default
    await Board.findByIdAndUpdate(board, { $push: { lists: savedList._id } })

    await savedList.populate("cards")

    res.status(201).json(savedList)
  } catch (error) {
    res.status(500).json({ message: "Failed to create list", error: error.message })
  }
}

export const updateList = async (req, res) => {
  try {
    const { title, position } = req.body
    const list = await List.findByIdAndUpdate(req.params.id, { title, position }, { new: true }).populate("cards")

    res.json(list)
  } catch (error) {
    res.status(500).json({ message: "Failed to update list", error: error.message })
  }
}

export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)

    if (!list) {
      return res.status(404).json({ message: "List not found" })
    }

    await Card.deleteMany({ list: req.params.id })
    await List.findByIdAndDelete(req.params.id)

    // Remove the list from the board's lists array
    const Board = (await import("../models/Board.js")).default
    await Board.findByIdAndUpdate(list.board, { $pull: { lists: req.params.id } })

    res.json({ message: "List deleted" })
  } catch (error) {
    res.status(500).json({ message: "Failed to delete list", error: error.message })
  }
}

export const reorderLists = async (req, res) => {
  try {
    const { lists } = req.body

    for (let i = 0; i < lists.length; i++) {
      await List.findByIdAndUpdate(lists[i], { position: i })
    }

    res.json({ message: "Lists reordered" })
  } catch (error) {
    res.status(500).json({ message: "Failed to reorder lists", error: error.message })
  }
}
