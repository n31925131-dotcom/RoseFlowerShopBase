# Rose Flower Shop Website

## Image Management
This website uses an automated gallery system.

### Folder Structure
- `images/gallery/Weddings/`, `Baptisms/`, `Events/`, `Bouquets/`: Add gallery images here.
- `images/banners/`: Banner images for page headers.
- `images/index/`, `about/`, `contact/`, `services/`: Local images for specific pages.

### Automatic Gallery
When image files are added or removed in GitHub, a GitHub Action automatically updates `images/gallery/images.json`. The gallery page reads this manifest at runtime.

### How to Change Images
1. Locate the image reference in the HTML (look for the `<!-- IMAGE SOURCE: ... -->` comment).
2. Replace the file at the specified path in the repository.
3. Push to GitHub.

### Manual Manifest Generation
If you want to regenerate the manifest locally:
```bash
# Run the shell script equivalent of the GitHub Action
echo "{\"categories\": [" > images/gallery/images.json
first_cat=true
for dir in images/gallery/*/ ; do
  if [ -d "$dir" ]; then
    category=$(basename "$dir")
    if [ "$category" != "All" ]; then
      if [ "$first_cat" = false ]; then echo "," >> images/gallery/images.json; fi
      echo "{\"name\": \"$category\", \"images\": [" >> images/gallery/images.json
      first_img=true
      for img in "$dir"*; do
        if [ -f "$img" ]; then
          filename=$(basename "$img")
          if [ "$first_img" = false ]; then echo "," >> images/gallery/images.json; fi
          echo "\"$filename\"" >> images/gallery/images.json
          first_img=false
        fi
      done
      echo "]}" >> images/gallery/images.json
      first_cat=false
    fi
  fi
done
echo "]}" >> images/gallery/images.json
```
