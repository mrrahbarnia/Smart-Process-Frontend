"use client"
import ArticleDetailContainer from "@/components/admin/articles/detail/ArticleDetailContainer";

const Page = ({params}: {params: {articleId: string}}) => {
    return (
        <ArticleDetailContainer isAdminRoute={false} articleId={params.articleId}/>
    )
};

export default Page;