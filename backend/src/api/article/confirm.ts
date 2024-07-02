import { FastifyPluginAsync } from "fastify";
import { confirmArticle, getUnconfirmedArticle, removeUnconfirmedArticle } from "../../database/authentication/articleHandler";
import validate from 'uuid-validate'

export const confirmArticleRoute : FastifyPluginAsync = async (fastify, option) => {
	fastify.post<{
		Params: ParamsConfirmArticleAPI,
		Body: BodyConfirmArticleAPI
	}>('/:articleId/get', async (req, res) => {

		const articleId = req.params.articleId;
		if(!validate(articleId)){
			res.statusCode = 400
      res.send({message: "Invalid article ID"})
      return
		}

		const confirmKey = req.body.confirmKey;
		if(!confirmKey){
			res.statusCode = 400
      res.send({message: "Invalid confirm key"})
      return
		}

		const articleInfo = await getUnconfirmedArticle(articleId, confirmKey)
		if(articleInfo.length === 0) {
      res.statusCode = 401
      res.send({message: "Unauthorized"})
      return
    }

		res.statusCode = 200
		res.send({authorId: articleInfo[0].userId, article: {
			title: articleInfo[0].title,
      thumbnail: articleInfo[0].thumbnail,
      content: articleInfo[0].content,
      category: articleInfo[0].category,
		}, message: "Get article successfully"})
	})

	fastify.post<{
		Params: ParamsConfirmArticleAPI
		Body: BodyConfirmArticleAPI
	}>('/:articleId', async (req, res) => {

		const articleId = req.params.articleId
		
		if(!validate(articleId)) {
			res.statusCode = 400
			res.send({message: "Invalid article ID"})
			return
		}

		const {article , confirmKey, authorId, confirmStatus} = req.body

		if(!article.title || !article.thumbnail || !article.content || !article.category || !confirmKey || confirmStatus === undefined) {
			res.statusCode = 400
      res.send({message: "Invalid article or confirm key"})
      return
		}

		const checkRemoveUnconfirmedArticle = await removeUnconfirmedArticle(articleId, confirmKey, article, authorId)

		if(!checkRemoveUnconfirmedArticle) {
			res.statusCode = 403
			res.send({message: "Forbidden!"})
			return
		}
		if(confirmStatus){
			await confirmArticle(article, authorId)
			res.statusCode = 200
			res.send({message: "Article is confirmed successfully"})
			return
		}


		res.statusCode = 200
		res.send({message: "Article is rejected successfully"})
	})
}