import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// Mock data for news articles
const newsArticles = [
  {
    id: "1",
    title: "Lakers Secure Playoff Spot with Dominant Win",
    excerpt:
      "The Los Angeles Lakers clinched their playoff berth with an impressive victory over the Warriors...",
    content: "Full article content would go here...",
    image: "/images/lokie.jpeg",
    category: "Game Recap",
    author: "John Smith",
    date: "2024-05-15T14:30:00",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: "2",
    title: "Rising Star: The Journey of a Young Point Guard",
    excerpt:
      "Meet the rookie who is taking the league by storm with his exceptional court vision...",
    content: "Full article content would go here...",
    image: "/images/lokies.jpeg",
    category: "Player Spotlight",
    author: "Sarah Johnson",
    date: "2024-05-14T10:15:00",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "3",
    title: "New Training Facility Opens in Downtown",
    excerpt:
      "State-of-the-art basketball training center opens its doors to professional athletes...",
    content: "Full article content would go here...",
    image: "/images/images.jpeg",
    category: "Facilities",
    author: "Mike Brown",
    date: "2024-05-13T16:45:00",
    readTime: "4 min read",
    featured: false,
  },
  // Add more articles as needed
];

const categories = [
  "All",
  "Game Recap",
  "Player Spotlight",
  "Team News",
  "Facilities",
  "Community",
  "Analysis",
];

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredArticles =
    selectedCategory === "All"
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  const featuredArticles = filteredArticles.filter(
    (article) => article.featured
  );
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Basketball News
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Stay updated with the latest news, game recaps, player
                spotlights, and more from the world of basketball.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-primary-50 dark:bg-primary-900/30"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Featured Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="relative h-64">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <CardBody>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                          {article.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {formatDate(article.date)}
                            </span>
                            <span className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {article.readTime}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            rightIcon={<ChevronRight size={16} />}
                          >
                            Read More
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <CardBody>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {formatDate(article.date)}
                        </span>
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {article.readTime}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        rightIcon={<ChevronRight size={16} />}
                      >
                        Read More
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};
