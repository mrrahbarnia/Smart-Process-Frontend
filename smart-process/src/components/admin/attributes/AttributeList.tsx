"use client"
import { AttributeType } from "@/hooks/useQueries/useGetAllAttributes";
import AttributeItem from "./AttributeItem";

const AttributeList = (props: {attributes: AttributeType[]}) => {
    return (
        <div className="flex flex-col gap-8 pt-4 w-full min-[500px]:w-[460px] mx-auto">
            {props.attributes.map(attribute => <AttributeItem key={attribute.name} attribute={attribute} />)}
        </div>
    )
};

export default AttributeList;