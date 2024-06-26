import { getPagesUnderRoute } from "nextra/context";
import filterRouteLocale from "nextra/filter-route-locale";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export function Cards({image, title, href, tag, author, score}) {
  // const { theme } = useTheme()

  // const bglightThemeStyle = "bg-gray-100";
  // const bgdarkThemeStyle = "bg-zinc-800  hover:bg-zinc-700";
  // const backgroundStyle = theme === 'dark' ? bgdarkThemeStyle : bglightThemeStyle;

  // const taglightThemeStyle = "bg-gray-300";
  // const tagdarkThemeStyle = "bg-slate-600";
  // const tagbackgroundStyle = theme === 'dark' ? tagdarkThemeStyle : taglightThemeStyle;

  // const cardlightThemeStyle = "border-gray-200 hover:shadow-md";
  // const carddarkThemeStyle = "border-zinc-600 hover:border-zinc-500";
  // const cardStyle = theme === 'dark' ? carddarkThemeStyle : cardlightThemeStyle;

  const yellowStars = Math.floor(score / 2);
  const grayStars = 5 - yellowStars;

  return (
    <a href={href} className={`flex flex-col flex-grow w-full rounded-lg border border-[#373A4C] overflow-hidden block bg-[#252630] hover:bg-[#34374b]`}>
      <img className="flex-col h-44 object-cover m-3 rounded-lg border border-[#31353A]" src={image} alt={title} />
      <div className={`mx-3 mt-1 mb-3`}>
        <h2 className="text-base font-bold">{title}</h2>
        <div className={`mt-2.5 bg-[#FFFFFF]/10 py-1 px-2 rounded text-sm inline-block whitespace-nowrap`}>{tag}</div>
        <div className={`mt-3 flex items-center`}>
          {author && (
            <>
              <img src="/author.jpg" alt="Author Image" className="mr-2 ml-1 size-5 rounded-full" /> 
              <p className="text-sm text-[#FFFFFF]/50">{author}</p>
            </>
          )}
          <div className="font-bold ml-8">
            {score}
          </div>
          <div className='flex size-4 ml-2'>
            {[...Array(yellowStars)].map((_, i) => <img key={i} src="/yellow-star.svg" alt="Star Icon" />)}
            {[...Array(grayStars)].map((_, i) => <img key={i} src="/gary-star.svg" alt="Star Icon" />)}
          </div>
        </div>
      </div>
    </a>
  );
}

const countCardsByTag = (pages) => {
    const counts = {};
    pages.forEach(page => {
      const tag = page.frontMatter?.tag;
      if (tag) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    });
    return counts;
  }

export function PageCard({pagesUnderRoute, selectedTag}){
  const { locale, defaultLocale } = useRouter();

  const pages = filterRouteLocale(getPagesUnderRoute(pagesUnderRoute), locale, defaultLocale)
    .filter(page => !selectedTag || page.frontMatter?.tag === selectedTag);

  return (
    <>
      {pages.map((page, index) => {
        return (
          <Cards 
            key={index}
            image={page.frontMatter?.image} 
            title={page.meta?.title || page.frontMatter?.title || page.name} 
            href={page.route}
            tag={page.frontMatter?.tag}
            author={page.frontMatter?.author || "Unknown"}
            score = {page.frontMatter?.score || 0}
          />
        );
      })}
    </>
  );
}

export default function TemplateCards() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagCounts, setTagCounts] = useState({});
  const tagStyle = "rounded-2xl px-4 py-1 text-white mr-2 mb-6";

  const pagesUnderRoute = useMemo(() => getPagesUnderRoute("/templates"), []);
  

  useEffect(() => {
    setTagCounts(countCardsByTag(pagesUnderRoute));
  }, [pagesUnderRoute]);

  const totalCards = Object.keys(tagCounts).length > 0 ? Object.values(tagCounts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="mt-6">
      <div>
        <button className={` ${tagStyle} ${selectedTag === null ? 'bg-[#454758]' : 'bg-[#262837]'} `} onClick={() => setSelectedTag(null)}>All ({totalCards})</button>
        {
          Object.keys(tagCounts).map(tag => (
            <button 
              key={tag}
              className={` ${tagStyle} ${selectedTag === tag ? 'bg-[#454758]' : 'bg-[#262837]'} `}
              onClick={() => setSelectedTag(tag)}
            >
              {tag} ({tagCounts[tag] || 0})
            </button>
          ))
        }
      </div>
      <div className="grid grid-cols-3 gap-4 ">
        <PageCard 
        pagesUnderRoute={"/templates"}
        selectedTag={selectedTag}
      />
      </div>
    </div>
  );
}