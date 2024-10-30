"use client"
import { ArticleType } from "@/hooks/useQueries/useGetAllArticles";
import ArticleItem from "./ArticleItem";


const ArticleList = (props: {articles: ArticleType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.articles.map(article => <ArticleItem key={article.id} article={article} />)}
        </div>
    )
};

export default ArticleList;
