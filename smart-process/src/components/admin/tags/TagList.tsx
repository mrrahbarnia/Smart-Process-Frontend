"use client"
import { TagType } from "@/hooks/useQueries/useGetAllTags";
import TagItem from "./TagItem";

const TagList = (props: {tags: TagType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.tags.map(tag => <TagItem key={tag.name} tag={tag} />)}
        </div>
    )
};

export default TagList;
