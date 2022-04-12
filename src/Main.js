import React, { useEffect } from "react";

import { db, functions } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";


const sendEmail = httpsCallable(functions,'sendEmail');

const Main = () => {

    const testCollectionRef = collection(db, "test");

    useEffect(() => {
        getDocs(testCollectionRef).then((data) => {
            console.log(data)
        });
    }, [testCollectionRef]);

    const onClick = () => {
        sendEmail({
            name: "Shosuke DOI",
            email: "sho@olive.app",
            message: "hello world"
        });
    };

    return (
      <div>
          <button onClick={onClick}>Click</button>
      </div>
    );
};

export default Main;