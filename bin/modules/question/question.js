// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const Question = require('../question/question_model');
const User = require('../user/user_model');
const Reply = require('../question/replyModel');
const { v4: uuidv4 } = require('uuid');
// const catchAsync = require('../utils/catchAsync');

// const secretKey = process.env.SECRET_KEY;

async function createQuestion(req, res) {
    const { questionTitle, description, tags, media} = req.body;
    const user = req.user;
    // console.log(user);
    try {
         // Validate question duplicates
        const questionCheck = await Question.findOne({questionTitle});
    
        if (questionCheck) {
            return res.status(400).json({ message: 'Sudah ada pertanyaan yang sama !!!' });
        }
        if(questionTitle){
            const newQuestion = await Question.create({
                questionId: uuidv4(),
                questionTitle: questionTitle,
                description: description,
                tags: tags,
                creatorId: user.userId,
                createdAt: Date.now(),
                // media: media,
            });
            // console.log(newQuestion);
            const owner = await User.findOne({userId: user.userId});
            owner.questionCount += 1;
            owner.save();
            // const newQuestion = new UserModel({ name, email, password: hashedPassword, religion });
            // await newQuestion.save();
    
            // res.status(201).json({ message: 'User registered successfully' });
            const response = {
                message: 'Question created successfully',
                question: newQuestion 
            };
            res.status(201).json(response);
        }
    } catch (err) {
        // console.log(err);
        res.status(500).json("Couldn't create Question!! Please try again!");
    }
}

async function editQuestion(req, res) {
    const { questionId } = req.params
    const { questionTitle, description, tags} = req.body;
    const user = req.user;
    try {
        const question = await Question.findOne({questionId});

        if (question.creatorId?.toString() !== user?.userId?.toString()) {
            res.status(400).json("You are not allowed to Edit this post!");
            return;
        }
        if (!questionTitle){
            questionTitle = Question.questionTitle;
        }
        if (!description){
            description = Question.description;
        }
        if (!tags){
            tags = Question.tags;
        }
            
        const update = await Question.findOneAndUpdate({questionId}, {
            $set: {
                questionTitle: questionTitle,
                description: description,
                tags: tags,
                // media: media,
            } 
        },
        {new: true});
        const response = {
            message: 'Question Updated successfully',
            updatedQuestion: update 
        };
        res.status(200).json(response);
       
    } catch (err) {
        // console.log(err);
        res.status(500).json("Couldn't Edit Question!! Please try again!");
    }
}

async function deleteQuestion(req, res) {
    const { questionId } = req.params;
    const user = req.user;
    try {
        const question = await Question.findOne({ questionId });
        const owner = await User.findOne({userId: question.creatorId});
        // console.log(question);
        // console.log(owner);
        if (question.creatorId?.toString() !== user?.userId?.toString()) {
            res.status(400).json("You are not allowed to Delete this post!");
            return;
        }

        owner.questionCount -= 1;
        owner.save();

        await Reply.deleteMany({ replyToPost: question.questionId });
        await Question.findOneAndDelete(question?.questionId);
        res.status(201).json({Message: 'Question Deleted successfully'});
    } catch (err) {
        // console.log(err);
        res.status(500).json("Couldn't delete doubt!! Please try again!");
    }
}

async function addReply(req, res) {
    const { questionId } = req.params;
    const { reply } = req.body;
    const user = req.user;
    // console.log(questionId, reply);
    // console.log(user);
    try {
        const question = await Question.findOne({ questionId });
        const newReply = await Reply.create({
            replyId: uuidv4(),
            creatorId: user.userId,
            reply: reply,
            replyToPost: questionId,
            createdAt: Date.now(),
        });
        newReply.save();
        // console.log(question);
        // console.log(newReply);
        const _user = await User.findOne({userId: user.userId});
       
        _user.repliesCount += 1;
        _user.save();
        
        // const replies = await Reply.find({ replyToPost: question.questionId }).sort({ createdAt: -1 });

        // const replyInfo = [];
        // for (const reply of replies)
        //     replyInfo.push({ replyData: reply, ownerInfo: user} );

        // res.status(201).json({
        //     doubtData: question, ownerInfo: user, replies: replyInfo
        // });
        res.status(201).json({
            Message: "Reply Added !!!", newReply
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json("Couldn't add reply!! Please try again!");
    }
}

async function vote(req, res) {
    const { questionId } = req.params;
    const { type } = req.body;
    const user = req.user;

    try {
        const question = await Question.findOne({questionId});
        const owner = await User.findOne({userId: question.creatorId});

        if (type === "up") {
            if (question.downVotes.indexOf(user.userId) !== -1)
                question.downVotes.splice(question.downVotes.indexOf(user.userId), 1);

            if (question.upVotes.indexOf(user.userId) === -1)
                question.upVotes.push(user.userId);
            else
                question.upVotes.splice(question.upVotes.indexOf(user.userId), 1);
        } else {
            if (question.upVotes.indexOf(user.userId) !== -1)
                question.upVotes.splice(question.upVotes.indexOf(user.userId), 1);

            if (question.downVotes.indexOf(user.userId) === -1)
                question.downVotes.push(user.userId);
            else
                question.downVotes.splice(question.downVotes.indexOf(user.userId), 1);
        }

        await question.save();

        // const replyInfo = [];

        // const replies = await Reply.find({ replyToPost: question.questionId }).sort({ createdAt: -1 });
        // for (const reply of replies)
        //     replyInfo.push({ replyData: reply, ownerInfo: await User.findOne({userId: reply.creatorId}) });
        res.status(201).json({
            Message: "Vote Sucessfull", votes: type
        });

        // res.status(200).json({ question, ownerInfo: owner, replies: replyInfo });
    } catch (err) {
        // console.log(err);
        res.status(500).json("Error occurred while processing! Please try again!");
    }
}

async function getAllQuestion(req, res) {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        const response = [];

        for (const question of questions) {
            const userDetails = await User.findOne({userId: question?.creatorId});
            const reqInfo = new Object({
                name: userDetails?.name,
                // photo: userDetails?.photo,
                // reputation: userDetails?.reputation
            });
            response.push({ doubtDetails: question, ownerInfo: reqInfo });
        }
        res.status(200).json(response);
    } catch (err) {
        // console.log(err);
        res.status(500).json("Error occurred while processing! Please try again!");
    }
}

async function getQuestionDetail(req, res) {
    const { questionId } = req.params;
    // console.log(questionId);
    try {
        const question = await Question.findOne({questionId: questionId});
        question.views += 1;

        question.save();
        const replyCount = await Reply.countDocuments({replyToPost: question.questionId});
        // console.log(replyCount);
        const questionReplies = await Reply.find({ replyToPost: question.questionId }).sort({ createdAt: -1 });
        const replyInfo = [];


        for (const reply of questionReplies)
            replyInfo.push({ replyData: reply, ownerInfo: await User.findOne({userId: reply.creatorId}) });

        const owner = await User.findOne({userId: question.creatorId});
        res.status(200).json({ 
            questionData: question, 
            replyCount: replyCount,
            ownerInfo: owner, 
            replies: replyInfo
            
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json("Internal server error! Please try again!");
    }
}

async function voteToReply(req, res) {
    const { doubt, reply, type, user } = req.body;
    try {
        const doubtData = doubt?.doubtData;
        const doubtOwner = doubt?.ownerInfo;

        const _reply = await Reply.findById(reply?._id);
        if (type === "up") {
            const dIdx = _reply.downVotes.indexOf(user?._id);
            if (dIdx !== -1)
                _reply.downVotes.splice(dIdx, 1);

            const uIdx = _reply.upVotes.indexOf(user?._id);
            if (uIdx === -1)
                _reply.upVotes.push(user?._id);
            else
                _reply.upVotes.splice(uIdx, 1);
            } else {
                const uIdx = _reply.upVotes.indexOf(user?._id);
                if (uIdx !== -1)
                    _reply.upVotes.splice(uIdx, 1);
    
                const dIdx = _reply.downVotes.indexOf(user?._id);
                if (dIdx === -1)
                    _reply.downVotes.push(user?._id);
                else
                    _reply.downVotes.splice(dIdx, 1);
            }
            _reply.save();
            const owner = await User.findById(_reply.creator);
    
            const replies = doubt?.replies?.map((__reply) => {
                if (__reply?.replyData?._id?.toString() !== _reply._id?.toString())
                    return __reply;
                else
                    return { replyData: _reply, ownerInfo: owner };
            });
    
            res.status(200).json({ doubtData: doubtData, ownerInfo: doubtOwner, replies: replies });
        } catch (err) {
            res.status(500).json(err);
        }
    }
    
    async function sortReplies(req, res) {
        const { questionId } = req.params;
        const { type } = req.body;
        // console.log(questionId, type);
        try {
            // const doubt = await Doubt.findById(id);
            const question = await Question.findOne({questionId});
    
            let questionReplies = [];
            if (type === "most_recent")
                questionReplies = await Reply.find({ replyToPost: question.questionId }).sort({ createdAt: -1 });
            else {
                questionReplies = await Reply.find({ replyToPost: question.questionId });
                questionReplies?.sort((a, b) => b?.upVotes?.length - a?.upVotes?.length);
                questionReplies = questionReplies?.splice(-10);
            }
            const replyInfo = [];
    
            for (const reply of questionReplies)
                replyInfo.push({ replyData: reply, ownerInfo: await User.findOne({userId: reply.creatorId}) });
    
            const owner = await User.findOne({userId: question.creatorId});
            res.status(200).json({ doubtData: question, ownerInfo: owner, replies: replyInfo });
        } catch (err) {
            res.status(500).json(err);
        }
    }
    
    module.exports = {
        createQuestion,
        editQuestion,
        deleteQuestion,
        addReply,
        vote,
        getAllQuestion,
        getQuestionDetail,
        voteToReply,
        sortReplies
    };
