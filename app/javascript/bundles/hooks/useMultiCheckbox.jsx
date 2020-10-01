import { useEffect, useState } from "react";
import URLSearchParams from "@ungap/url-search-params";

function useMultiCheckbox(ids, selectedPage) {
  const [checkedItems, setCheckedItems] = useState({});
  const [masterCheck, setMasterCheck] = useState({});

  // useEffect(() => {
    const checkAll = () => {
      console.log('executing');
      console.log(ids);
      const pageEntries = {};
      const pageNo = selectedPage + 1
      ids.forEach(entry => {
        pageEntries[entry] = !masterCheck[pageNo];
      });
      // setMasterCheck({ ...masterCheck, [selectedPage + 1]: !masterCheck[selectedPage + 1] });
      setCheckedItems({ ...checkedItems, ...pageEntries });
    };
    // const handleCheckboxChange = event => {
    //   // See this: https://dev.to/sagar/three-dots---in-javascript-26ci
    //   // This is basically doing
    //   // var mergedObj = { ...obj1, ...obj2 };
    //   // Object { foo: "baz", x: 42, y: 13 }
    //   // It's making a copy of all checkedItems and adds the newest key/value pair:
    //   // [event.target.id]: event.target.checked
    //   setCheckedItems({ ...checkedItems, [event.target.id]: event.target.checked });
    // };

  // }, [masterCheck]);

  return {checkedItems, masterCheck, checkAll};
}

export default useMultiCheckbox;