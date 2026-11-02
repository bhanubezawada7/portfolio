import os
import numpy as np  # type: ignore
import tensorflow as tf  # type: ignore
from scipy.ndimage import binary_fill_holes, gaussian_filter, label  # type: ignore

# Read original portrait
img_path = 'public/assets/bhausri_portrait.jpg'
raw = open(img_path, 'rb').read()
img = tf.io.decode_jpeg(raw).numpy()
h, w, c = img.shape

r = img[:, :, 0].astype(np.float32)
g = img[:, :, 1].astype(np.float32)
b = img[:, :, 2].astype(np.float32)

diff_rg = np.abs(r - g)
diff_gb = np.abs(g - b)
diff_rb = np.abs(r - b)
max_diff = np.maximum(diff_rg, np.maximum(diff_gb, diff_rb))
brightness = (r + g + b) / 3.0

is_skin_or_warm = (r - b > 16) | (r - g > 12)
is_hair = (brightness < 90)

is_neutral_bg = (
    (brightness > 240) |
    ((brightness >= 180) & (max_diff <= 17) & ~is_skin_or_warm) |
    ((brightness >= 120) & (max_diff <= 12) & ~is_skin_or_warm & ~is_hair)
)

from collections import deque

bg_mask = np.zeros((h, w), dtype=bool)
visited = np.zeros((h, w), dtype=bool)
q = deque()

for x in range(w):
    q.append((0, x))
    visited[0, x] = True
for y in range(h):
    if not visited[y, 0]:
        q.append((y, 0))
        visited[y, 0] = True
    if not visited[y, w - 1]:
        q.append((y, w - 1))
        visited[y, w - 1] = True

while q:
    cy, cx = q.popleft()
    if cy > 640 and 130 < cx < 630:
        continue

    if is_neutral_bg[cy, cx]:
        bg_mask[cy, cx] = True
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                visited[ny, nx] = True
                if is_neutral_bg[ny, nx]:
                    q.append((ny, nx))

subject_mask = ~bg_mask

# Remove stray outer chair corners
subject_mask[770:, :60] = False
subject_mask[770:, 680:] = False

for y in range(500, h):
    row_subject = np.where(subject_mask[y, :])[0]
    if len(row_subject) > 0:
        x_min = max(0, row_subject[0])
        x_max = min(w - 1, row_subject[-1])
        if x_max - x_min > 200:
            subject_mask[y, x_min:x_max] = True

subject_mask = binary_fill_holes(subject_mask)

from scipy.ndimage import binary_opening, binary_closing  # type: ignore
subject_mask = binary_closing(subject_mask, structure=np.ones((9, 9)))
subject_mask = binary_opening(subject_mask, structure=np.ones((3, 3)))
subject_mask = binary_fill_holes(subject_mask)

# Feathering
alpha = subject_mask.astype(np.float32) * 255.0
alpha = gaussian_filter(alpha, sigma=1.2)
alpha = np.clip(alpha, 0, 255).astype(np.uint8)

rgba = np.zeros((h, w, 4), dtype=np.uint8)
rgba[:, :, :3] = img
rgba[:, :, 3] = alpha

out_path = 'public/assets/bhausri_cutout.png'
encoded = tf.io.encode_png(rgba).numpy()
with open(out_path, 'wb') as f:
    f.write(encoded)

print(f"Cleaned bhausri_cutout.png saved. Subject pixels: {np.sum(alpha > 128)}")
