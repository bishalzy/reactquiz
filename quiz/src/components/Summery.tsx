
type SummeryProps = {
    show: boolean;
    quiz: unknown[];
    disableSummery: (value: boolean) => void;
    useranswer: number[];
};

const Summery = ({ show, quiz, disableSummery, useranswer }: SummeryProps) =>{
    console.log("quiz in summery", quiz);
    console.log("useranswer in summery", useranswer);

    return(
        <div className={show ? "summery-show" : "summery-hide"}>
            this is summery page
            <button onClick={() => disableSummery(false)}>close</button>
        </div>
    )
}


export default Summery;