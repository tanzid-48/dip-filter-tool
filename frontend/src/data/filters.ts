export interface ExamQA {
  question: string;
  bengaliExplanation: string;
  examAnswer: string;
}

export interface FilterContent {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  overview: string;
  howItWorks: string[];
  kernel: string[][];
  formula: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  codeSnippet: string;
  examQA: ExamQA[];
}

export const filters: FilterContent[] = [
  {
    slug: "mean",
    name: "Mean Filter",
    category: "Smoothing",
    tagline: "Averages every pixel with its neighbours to smooth out noise.",
    overview:
      "Mean Filter হলো একটা linear smoothing filter, যেটা প্রতিটা pixel-কে তার আশেপাশের (neighborhood) pixel-গুলোর arithmetic average দিয়ে replace করে। এটাই DIP-এর সবচেয়ে সরল noise-reduction technique।",
    howItWorks: [
      "একটা n×n kernel/window নেওয়া হয় (সাধারণত 3×3 বা 5×5)",
      "কেন্দ্র pixel আর তার প্রতিবেশী মিলিয়ে সব value যোগ করা হয়",
      "যোগফলকে kernel-এর মোট cell সংখ্যা দিয়ে ভাগ করা হয় (average)",
      "এই average-ই কেন্দ্র pixel-এর নতুন value হয়ে বসে",
    ],
    kernel: [
      ["1/9", "1/9", "1/9"],
      ["1/9", "1/9", "1/9"],
      ["1/9", "1/9", "1/9"],
    ],
    formula: "New Pixel(x,y) = (1 / n²) × Σ Pixel(neighborhood)",
    bestFor: "Gaussian noise — ছোট, ক্রমাগত random pixel change",
    pros: [
      "Implement করা সহজ এবং হিসাব দ্রুত",
      "Gaussian-type noise-এ কার্যকরভাবে কাজ করে",
      "Convolution দিয়ে সহজে বোঝানো ও প্রয়োগ করা যায়",
    ],
    cons: [
      "Edge/sharp boundary নষ্ট করে ফেলে (blur করে দেয়)",
      "Extreme outlier pixel (Salt & Pepper noise) ভালোভাবে সরাতে পারে না",
      "Original-এ ছিল না এমন নতুন pixel value তৈরি করে",
    ],
    codeSnippet: `mean_filtered = cv2.blur(image, (5, 5))`,
    examQA: [
      {
        question:
          "Describe the characteristics, advantages, and limitations of the Mean filter.",
        bengaliExplanation:
          "Mean filter প্রতিটা pixel-কে আশেপাশের pixel-গুলোর average দিয়ে replace করে। যেহেতু এটা সব value-কে সমান গুরুত্ব দেয়, তাই ছোট এলোমেলো পরিবর্তন (Gaussian noise) একে অপরকে কাটাকাটি করে গড়ে original-এর কাছাকাছি ফিরে আসে। কিন্তু একটা extreme value (Salt & Pepper noise) average-কে ভুল দিকে টেনে নিয়ে যায়, আর সব জায়গায় averaging করায় sharp edge-ও নরম/blur হয়ে যায়।",
        examAnswer:
          "The Mean filter replaces each pixel with the arithmetic average of its neighborhood, using an equal-weight kernel (e.g. 1/9 per cell in a 3×3 window). Advantages: simple, fast, effective against Gaussian noise. Limitations: blurs edges and fine detail, and performs poorly on impulse (Salt & Pepper) noise because extreme values distort the average.",
      },
    ],
  },
  {
    slug: "median",
    name: "Median Filter",
    category: "Smoothing",
    tagline: "Sorts neighbourhood pixels and picks the middle value.",
    overview:
      "Median Filter একটা non-linear filter — এটা আশেপাশের pixel-গুলোকে sort করে ঠিক মাঝের (median) value দিয়ে কেন্দ্র pixel replace করে, average না নিয়ে। এই কারণে এটা extreme/outlier value-কে natural ভাবে বাদ দিতে পারে।",
    howItWorks: [
      "একটা n×n window-এর সব pixel value নেওয়া হয়",
      "সেই value-গুলো ছোট থেকে বড় sort করা হয়",
      "sorted list-এর ঠিক মাঝের value বেছে নেওয়া হয়",
      "এই median value-ই কেন্দ্র pixel-এর নতুন value হয়",
    ],
    kernel: [
      ["—", "—", "—"],
      ["—", "sort→median", "—"],
      ["—", "—", "—"],
    ],
    formula: "New Pixel(x,y) = median{ Pixel values in neighborhood }",
    bestFor: "Salt & Pepper noise — বিচ্ছিন্ন extreme (0 বা 255) pixel",
    pros: [
      "Salt & Pepper noise-এ অত্যন্ত কার্যকর",
      "Edge Mean filter-এর তুলনায় ভালোভাবে সংরক্ষণ করে",
      "নতুন value তৈরি করে না — existing pixel-ই বসায়",
    ],
    cons: [
      "Sorting-এর কারণে Mean-এর চেয়ে computationally একটু বেশি খরচসাপেক্ষ",
      "Gaussian noise-এর জন্য ততটা কার্যকর না",
      "খুব বড় kernel-এ detail হারানোর ঝুঁকি থাকে",
    ],
    codeSnippet: `median_filtered = cv2.medianBlur(image, 5)`,
    examQA: [
      {
        question:
          "Why is the Median filter preferred over the Mean filter for Salt & Pepper noise?",
        bengaliExplanation:
          "Salt & Pepper noise-এ কিছু pixel সম্পূর্ণ 0 বা 255 হয়ে যায় (extreme value)। Mean filter এই extreme value-কেও average-এ যোগ করে ফেলে, ফলে result ভুল দিকে টেনে যায়। কিন্তু Median filter sort করে মাঝের value নেয়, তাই extreme value sorting-এর পর তালিকার প্রান্তে চলে যায় এবং মাঝের (median) value-এর উপর কোনো প্রভাব ফেলে না।",
        examAnswer:
          "Because Median filtering sorts the neighborhood values and selects the middle one, extreme impulse values (0 or 255 from Salt & Pepper noise) are pushed to the ends of the sorted list and excluded from the result. The Mean filter, by contrast, averages all values including the extremes, which skews the output.",
      },
    ],
  },
  {
    slug: "gaussian",
    name: "Gaussian Filter",
    category: "Smoothing",
    tagline: "Weighted averaging where closer pixels matter more.",
    overview:
      "Gaussian Filter-ও একটা smoothing filter, কিন্তু Mean-এর মতো সমান weight না দিয়ে, Gaussian distribution (Bell curve) অনুযায়ী weight দেয় — কেন্দ্র pixel সবচেয়ে বেশি গুরুত্ব পায়, দূরের pixel কম।",
    howItWorks: [
      "একটা Gaussian kernel তৈরি হয়, যেখানে weight distance অনুযায়ী কমতে থাকে",
      "সব weight যোগ করলে ১ হয় (brightness অপরিবর্তিত রাখার জন্য)",
      "প্রতিটা neighborhood pixel তার weight দিয়ে গুণ করে যোগ করা হয়",
      "ফলাফল কেন্দ্র pixel-এর নতুন value হয়",
    ],
    kernel: [
      ["0.05", "0.24", "0.05"],
      ["0.24", "0.40", "0.24"],
      ["0.05", "0.24", "0.05"],
    ],
    formula: "G(x,y) = (1 / 2πσ²) × e^(-(x²+y²) / 2σ²)",
    bestFor: "Gaussian/sensor noise, natural optical blur simulation",
    pros: [
      "Mean-এর চেয়ে বেশি natural smoothing, detail বেশি ধরে রাখে",
      "Camera lens-এর প্রকৃত optical blur-এর সাথে mathematically সবচেয়ে কাছাকাছি",
      "σ (sigma) দিয়ে smoothing-এর মাত্রা নিয়ন্ত্রণ করা যায়",
    ],
    cons: [
      "Mean-এর চেয়ে সামান্য বেশি computational cost",
      "Salt & Pepper noise-এ Median-এর মতো কার্যকর না",
      "ভুল sigma বেছে নিলে অতিরিক্ত বা অপর্যাপ্ত smoothing হতে পারে",
    ],
    codeSnippet: `gaussian_filtered = cv2.GaussianBlur(image, (5, 5), sigmaX=1)`,
    examQA: [
      {
        question:
          "How does the Gaussian filter differ from the Mean filter in terms of weighting?",
        bengaliExplanation:
          "Mean filter সব প্রতিবেশী pixel-কে সমান গুরুত্ব দেয়। Gaussian filter Bell curve distribution অনুসরণ করে — কেন্দ্রের কাছাকাছি pixel বেশি weight পায়, দূরের pixel কম। এই কারণে Gaussian filter অপেক্ষাকৃত বেশি natural smoothing দেয় এবং original detail তুলনামূলক বেশি সংরক্ষণ করে।",
        examAnswer:
          "The Mean filter assigns equal weight to every pixel in the window, while the Gaussian filter assigns weights following a Gaussian (bell-curve) distribution — pixels closer to the center contribute more than distant ones. This makes Gaussian smoothing more natural and better at preserving detail than Mean filtering.",
      },
    ],
  },
  {
    slug: "laplacian",
    name: "Laplacian Filter",
    category: "Sharpening",
    tagline: "A second-derivative operator that finds and enhances edges.",
    overview:
      "Laplacian Filter smoothing-এর ঠিক বিপরীত কাজ করে — এটা ছবির edge (যেখানে pixel value হঠাৎ পরিবর্তন হয়) খুঁজে বের করে, mathematical second derivative ব্যবহার করে, এবং সেই তথ্য দিয়ে ছবিকে sharper করে তোলে।",
    howItWorks: [
      "প্রতিটা pixel-এর জন্য second derivative (পরিবর্তনের হারের পরিবর্তন) হিসাব করা হয়",
      "Flat/uniform এলাকায় ফলাফল প্রায় শূন্য হয়",
      "Edge/boundary-তে ফলাফল বড় (positive বা negative) হয়",
      "এই edge information original ছবির সাথে যোগ করলে ছবি sharp দেখায় (Unsharp Masking)",
    ],
    kernel: [
      ["0", "1", "0"],
      ["1", "-4", "1"],
      ["0", "1", "0"],
    ],
    formula: "∇²f = f(x+1,y) + f(x-1,y) + f(x,y+1) + f(x,y-1) − 4f(x,y)",
    bestFor: "Blurry ছবিকে sharpen করা, edge/boundary detect করা",
    pros: [
      "Edge/boundary নির্ভুলভাবে খুঁজে বের করে",
      "ছবির fine detail আরও prominent করে তোলে",
      "Isotropic — সব দিকের edge সমানভাবে ধরতে পারে",
    ],
    cons: [
      "Noise-এর প্রতি অত্যন্ত সংবেদনশীল (noise-কেও edge ভেবে amplify করে ফেলে)",
      "Output-এ negative value আসে, তাই আলাদা handling (absolute value) লাগে",
      "একা ব্যবহার করলে ছবি অস্বাভাবিক/harsh দেখাতে পারে",
    ],
    codeSnippet: `laplacian = cv2.Laplacian(gray_image, cv2.CV_64F)
sharpened = np.uint8(np.absolute(laplacian))`,
    examQA: [
      {
        question:
          "Describe the characteristics, advantages, and limitations of the Laplacian filter.",
        bengaliExplanation:
          "Laplacian filter second derivative ব্যবহার করে edge খুঁজে বের করে — flat এলাকায় value প্রায় শূন্য, edge-এ বড় value। এটা ছবিকে sharpen করতে ব্যবহার হয়, কিন্তু যেহেতু এটা 'পরিবর্তনের হার' মাপে, সামান্য noise-কেও edge ভেবে বড় করে ফেলে, তাই noisy ছবিতে সরাসরি ব্যবহার না করে আগে smoothing করে নেওয়া ভালো।",
        examAnswer:
          "The Laplacian filter is a second-order derivative operator that detects edges by measuring the rate of change of intensity change. It produces near-zero output in uniform regions and large values at edges. It is highly effective for sharpening but is very sensitive to noise, since noise is also interpreted as a rapid intensity change and gets amplified.",
      },
    ],
  },
];

export function getFilterBySlug(slug: string) {
  return filters.find((f) => f.slug === slug);
}
