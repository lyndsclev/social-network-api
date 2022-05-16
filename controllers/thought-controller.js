const { json } = require('express/lib/response');
const { Thought, User } = require('../models'); 
const { db } = require('../models/Thought');

const thoughtController = {

    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err); 
            res.status(400).json(err);
        });  
    }, 

    // get thought by id 
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => {

            // if no thought found, send 404
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' }); 
                return; 
            }
            res.json(dbThoughtData); 
        })
        .catch(err => {
            console.log(err); 
            res.status(400).json(err); 
        });
    },

    // create thought
    createThought(req, res) {
        Thought.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId }, 
                { $push: { thoughts: _id } }, 
                { new: true, runValidators: true }
            );
        })
        .then(dbUserData => {

            // if no user send 404
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' })
                return; 
            }
            res.json(dbUserData); 
        })
        .catch(err => res.json(err)); 
    }, 

    // update thought by id 
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true })
        .then(dbThoughtData => {

            // if no thought found, send 404
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' }); 
                return; 
            }
            res.json(dbThoughtData); 
        })
        .catch(err => res.status(400).json(err)); 
    }, 

    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
        .then(dbThoughtData => {

            // if no thought found, send 404
            if(!dbThoughtData) {
               return res.status(404).json({ message: 'No thought found with this id' }); 
            }
            return User.findOneAndUpdate(
                { _id: req.params.userId }, 
                { $pull: { thoughts: req.params.thoughtId }}, 
                { new: true }
            );
        })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' }); 
                return; 
            }
            res.json(dbThoughtData); 
        })
        .catch(err => res.status(400).json(err)); 
    }, 

    // create reaction 
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { $push: { reactions: req.body }}, 
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' }); 
                return; 
            }
            res.json(dbThoughtData); 
        })
        .catch(err => {
            console.log('NOT WORKING!'); 
            res.status(400).json(err); 
        }); 
    }, 

    // delete reaction 
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            { $pull: { reactions: { reactionId: req.body.reactionId }}}, 
            { new: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' }); 
                return; 
            }
            res.json({ message: 'Reaction was removed' }); 
        })
        .catch(err => res.json(err)); 
    }
}; 

module.exports = thoughtController; 