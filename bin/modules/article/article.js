const Question = require('../question/question_model');
const User = require('../user/user_model');
const Reply = require('../question/replyModel');
const Article = require('../article/article_model');
const { v4: uuidv4 } = require('uuid');


async function createArticle(req, res) {
    const { articleTitle, description, tags, media} = req.body;
    const user = req.user;
    // console.log(articleTitle, description, tags);
    try {
         // Validate question duplicates
        const articleCheck = await Article.findOne({articleTitle});
    
        if (articleCheck) {
            return res.status(400).json({ message: 'Sudah ada Artikel yang sama !!!' });
        }
        if(articleTitle){
            const newArticle = await Article.create({
                articleId: uuidv4(),
                articleTitle: articleTitle,
                description: description,
                tags: tags,
                creatorId: user.userId,
                createdAt: Date.now(),
                // media: media,
            });
            // console.log(newQuestion);
            const owner = await User.findOne({userId: user.userId});
            owner.articleCount += 1;
            owner.save();
            const response = {
                message: 'article created successfully',
                article: newArticle 
            };
            res.status(201).json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Couldn't create Question!! Please try again!");
    }
}

async function getAllArticle(req, res) {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        const response = [];

        for (const article of articles) {
            const userDetails = await User.findOne({userId: article?.creatorId});
            const reqInfo = new Object({
                name: userDetails?.name,
                // photo: userDetails?.photo,
                // reputation: userDetails?.reputation
            });
            response.push({ articleDetails: article, ownerInfo: reqInfo });
        }
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error occurred while processing! Please try again!");
    }
}

async function getArticleDetail(req, res) {
    const { articleId } = req.params;
    // console.log(articleId);
    try {
        const article = await Article.findOne({articleId: articleId});
        article.views += 1;
        
        article.save();
        const replyCount = await Reply.countDocuments({replyToPost: article.articleId});
        // console.log(replyCount);
        const articleReplies = await Reply.find({ replyToPost: article.articleId }).sort({ createdAt: -1 });
        const replyInfo = [];


        for (const reply of articleReplies)
            replyInfo.push({ replyData: reply, ownerInfo: await User.findOne({userId: reply.creatorId}) });

        const owner = await User.findOne({userId: article.creatorId});
        res.status(200).json({ 
            articleData: article, 
            replyCount: replyCount,
            ownerInfo: owner, 
            replies: replyInfo
            
        });
    } catch (err) {
        // console.log(err);
        res.status(500).json("Internal server error! Please try again!");
    }
}

async function addReply(req, res) {
    const { articleId } = req.params;
    const { reply } = req.body;
    const user = req.user;
    // console.log(questionId, reply);
    // console.log(user);
    try {
        const article = await Article.findOne({ articleId });
        const newReply = await Reply.create({
            replyId: uuidv4(),
            creatorId: user.userId,
            creatorName: user.name,
            reply: reply,
            replyToPost: articleId,
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

module.exports = {
    createArticle,
    getAllArticle,
    getArticleDetail,
    addReply
};