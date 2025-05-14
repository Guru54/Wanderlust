const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings =  await   Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
 res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let  { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
         populate: { 
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req,res)=> {
let response =  await  geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();


  let url = req.file.path;
  let filename = req.file.filename;
   const newListing = new Listing(req.body.listing);
   if(!req.body.listing){
    throw new ExpressError(400,"listing bad request");
   }
    newListing.image = { filename, url };
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
  let savelisting =   await newListing.save();
  console.log(savelisting);

    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing not found!");
        return res.redirect("/listings");
    }
    let url = listing.image.url;
   let imageurl = url.replace("/upload", "/upload/c_scale,h_300,w_300");

    //req.flash("success", "listing edited successfully!");
    res.render("listings/edit.ejs", { listing , imageurl});
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Check if a file was uploaded
    let url, filename;
    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }

    // Update the listing, including the image if a file was uploaded
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            ...req.body.listing,
            ...(req.file && { image: { filename, url } }) // Only update image if a file was uploaded
        },
        { new: true, runValidators: true }
    );

    if (!updatedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${updatedListing._id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
}
