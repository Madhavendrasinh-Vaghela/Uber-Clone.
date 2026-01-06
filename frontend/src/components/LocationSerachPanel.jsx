const LocationSeearchPanel = (props) => {
    const { suggestions = [], onSuggestionClick, onFindTrip } = props;

    const handleFindTrip = () => {
        if (onFindTrip) {
            onFindTrip();
        }
    };
    
    return(
        <div>
            {/* Display API-fetched suggestions */}
            {suggestions.length > 0 ? (
                suggestions.map(function(suggestion, idx){
                    return <div key={idx} onClick={()=>{
                        onSuggestionClick(suggestion);
                        // Don't navigate here, let user click Find Trip button to proceed
                    }} className="flex gap-4 border-2 border-gray-50 active:border-black p-3 rounded-xl items-center my-2 justify-start transition-all cursor-pointer hover:border-gray-300">
            <h2 className="bg-[#eee] h-8 w-12 flex items-center justify-center rounded-full shrink-0">
                <i className="ri-map-pin-fill text-lg"></i>
                </h2>
            <h4 className="font-medium text-sm text-gray-800">{suggestion.name}</h4>
        </div>
                })
            ) : (
                <div className="flex items-center justify-center p-6 text-gray-500">
                    <p>Type at least 3 characters to see suggestions</p>
                </div>
            )}

            {/* Find Trip Button - Always visible */}
            <button
                onClick={handleFindTrip}
                className="w-full bg-black text-white py-3 rounded-lg mt-4 font-semibold hover:bg-gray-800 transition-colors"
            >
                Find Trip
            </button>
        </div>
    )
}

export default LocationSeearchPanel;