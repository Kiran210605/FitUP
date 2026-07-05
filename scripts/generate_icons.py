from pathlib import Path
from PIL import Image, ImageDraw

root = Path('public')
size = 512
img = Image.new('RGBA', (size, size), (37, 99, 235, 255))
mask = Image.new('L', (size, size), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=90, fill=255)
img = Image.composite(img, Image.new('RGBA', (size, size), (255, 255, 255, 255)), mask)

draw = ImageDraw.Draw(img)
draw.rounded_rectangle((80, 140, 432, 370), radius=30, fill=(255, 255, 255, 255))
draw.rounded_rectangle((132, 95, 200, 380), radius=24, fill=(255, 255, 255, 255))
draw.rounded_rectangle((312, 95, 380, 380), radius=24, fill=(255, 255, 255, 255))
draw.ellipse((140, 148, 190, 198), fill=(37, 99, 235, 255))
draw.ellipse((320, 148, 370, 198), fill=(37, 99, 235, 255))
draw.text((135, 410), 'GYM', fill=(255, 255, 255, 255))

for s in [192, 512]:
    resized = img.resize((s, s), Image.Resampling.LANCZOS)
    resized.save(root / f'icon-{s}.png')
