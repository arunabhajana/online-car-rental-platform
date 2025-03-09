
const SearchSection = () => {

    return (
        <>
            <div className="flex justify-center mt-10">
                <div className="card bg-base-100 shadow-md p-6 w-full max-w-3xl">
                    <div className="card-body">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="label">Pickup Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Pickup Date</label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Dropoff Date</label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchSection;