import { useState } from "react";

function useMultiCheckbox() {
  const [checkedItems, setCheckedItems] = useState({});
  const [masterCheck, setMasterCheck] = useState({});

// `masterCheck` is scoped per page
// `pageEntries` are scoped per page and can be progressively added
// ids are the batch of a given page's entry ids
  const checkAll = ids => {
    const pageEntries = {};
    ids.forEach(entry => {
      pageEntries[entry] = !masterCheck[selectedPage + 1];
    });
    setMasterCheck({ ...masterCheck, [selectedPage + 1]: !masterCheck[selectedPage + 1] });
    setCheckedItems({ ...checkedItems, ...pageEntries });
  };

  const handleCheckboxChange = event => {
    // See this: https://dev.to/sagar/three-dots---in-javascript-26ci
    // This is basically doing
    // var mergedObj = { ...obj1, ...obj2 };
    // Object { foo: "baz", x: 42, y: 13 }
    // It's making a copy of all checkedItems and adds the newest key/value pair:
    // [event.target.id]: event.target.checked
    setCheckedItems({ ...checkedItems, [event.target.id]: event.target.checked });
  };

  return {checkedItems, masterCheck, checkAll, handleCheckboxChange}
}

export default useMultiCheckbox;