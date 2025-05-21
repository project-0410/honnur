
-- FreshMeal Planner Database Schema
-- A comprehensive database for recipe management, meal planning, and shopping lists

-- -----------------------------------------------------
-- Database Creation
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS freshmeal_planner;
USE freshmeal_planner;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)
);

-- -----------------------------------------------------
-- Table `recipe_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipe_categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

-- -----------------------------------------------------
-- Table `recipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipes` (
  `recipe_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `prep_time` INT NULL COMMENT 'Preparation time in minutes',
  `cook_time` INT NULL COMMENT 'Cooking time in minutes',
  `servings` INT NULL,
  `difficulty` ENUM('Easy', 'Medium', 'Hard') NULL,
  `image_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`),
  INDEX `fk_recipes_users_idx` (`user_id` ASC),
  INDEX `fk_recipes_categories_idx` (`category_id` ASC),
  CONSTRAINT `fk_recipes_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recipes_categories`
    FOREIGN KEY (`category_id`)
    REFERENCES `recipe_categories` (`category_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `ingredient_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ingredient_categories` (
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

-- -----------------------------------------------------
-- Table `ingredients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ingredients` (
  `ingredient_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category_id` INT NOT NULL,
  `default_unit` VARCHAR(20) NULL,
  PRIMARY KEY (`ingredient_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `fk_ingredients_categories_idx` (`category_id` ASC),
  CONSTRAINT `fk_ingredients_categories`
    FOREIGN KEY (`category_id`)
    REFERENCES `ingredient_categories` (`category_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `recipe_ingredients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
  `recipe_id` INT NOT NULL,
  `ingredient_id` INT NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NULL,
  `notes` VARCHAR(255) NULL,
  PRIMARY KEY (`recipe_id`, `ingredient_id`),
  INDEX `fk_recipe_ingredients_ingredients_idx` (`ingredient_id` ASC),
  CONSTRAINT `fk_recipe_ingredients_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recipe_ingredients_ingredients`
    FOREIGN KEY (`ingredient_id`)
    REFERENCES `ingredients` (`ingredient_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `recipe_instructions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipe_instructions` (
  `instruction_id` INT NOT NULL AUTO_INCREMENT,
  `recipe_id` INT NOT NULL,
  `step_number` INT NOT NULL,
  `instruction` TEXT NOT NULL,
  PRIMARY KEY (`instruction_id`),
  INDEX `fk_instructions_recipes_idx` (`recipe_id` ASC),
  CONSTRAINT `fk_instructions_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `nutrition_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nutrition_info` (
  `recipe_id` INT NOT NULL,
  `calories` INT NULL,
  `protein` DECIMAL(10,2) NULL COMMENT 'in grams',
  `carbs` DECIMAL(10,2) NULL COMMENT 'in grams',
  `fat` DECIMAL(10,2) NULL COMMENT 'in grams',
  `fiber` DECIMAL(10,2) NULL COMMENT 'in grams',
  `sugar` DECIMAL(10,2) NULL COMMENT 'in grams',
  `sodium` DECIMAL(10,2) NULL COMMENT 'in milligrams',
  PRIMARY KEY (`recipe_id`),
  CONSTRAINT `fk_nutrition_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `meal_plans`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `meal_plans` (
  `plan_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`plan_id`),
  INDEX `fk_meal_plans_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_meal_plans_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `meal_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `meal_types` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`type_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

-- -----------------------------------------------------
-- Table `planned_meals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `planned_meals` (
  `planned_meal_id` INT NOT NULL AUTO_INCREMENT,
  `plan_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `meal_type_id` INT NOT NULL,
  `day_date` DATE NOT NULL,
  `servings` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`planned_meal_id`),
  INDEX `fk_planned_meals_meal_plans_idx` (`plan_id` ASC),
  INDEX `fk_planned_meals_recipes_idx` (`recipe_id` ASC),
  INDEX `fk_planned_meals_meal_types_idx` (`meal_type_id` ASC),
  CONSTRAINT `fk_planned_meals_meal_plans`
    FOREIGN KEY (`plan_id`)
    REFERENCES `meal_plans` (`plan_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_planned_meals_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_planned_meals_meal_types`
    FOREIGN KEY (`meal_type_id`)
    REFERENCES `meal_types` (`type_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `shopping_lists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shopping_lists` (
  `list_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`list_id`),
  INDEX `fk_shopping_lists_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_shopping_lists_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `shopping_list_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `shopping_list_items` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `list_id` INT NOT NULL,
  `ingredient_id` INT NULL,
  `name` VARCHAR(100) NOT NULL,
  `quantity` DECIMAL(10,2) NULL,
  `unit` VARCHAR(20) NULL,
  `category` VARCHAR(50) NULL,
  `checked` BOOLEAN NOT NULL DEFAULT FALSE,
  `added_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  INDEX `fk_shopping_list_items_lists_idx` (`list_id` ASC),
  INDEX `fk_shopping_list_items_ingredients_idx` (`ingredient_id` ASC),
  CONSTRAINT `fk_shopping_list_items_lists`
    FOREIGN KEY (`list_id`)
    REFERENCES `shopping_lists` (`list_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_shopping_list_items_ingredients`
    FOREIGN KEY (`ingredient_id`)
    REFERENCES `ingredients` (`ingredient_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `user_favorite_recipes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_favorite_recipes` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `added_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `recipe_id`),
  INDEX `fk_favorites_recipes_idx` (`recipe_id` ASC),
  CONSTRAINT `fk_favorites_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `user_ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_ratings` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `rating` TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `comment` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `recipe_id`),
  INDEX `fk_ratings_recipes_idx` (`recipe_id` ASC),
  CONSTRAINT `fk_ratings_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ratings_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

-- -----------------------------------------------------
-- Table `recipe_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipe_tags` (
  `recipe_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`recipe_id`, `tag_id`),
  INDEX `fk_recipe_tags_tags_idx` (`tag_id` ASC),
  CONSTRAINT `fk_recipe_tags_recipes`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `recipes` (`recipe_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_recipe_tags_tags`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tags` (`tag_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Triggers
-- -----------------------------------------------------

-- Trigger to automatically create a shopping list for a new user
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO shopping_lists (user_id, name)
  VALUES (NEW.user_id, 'Default Shopping List');
END$$
DELIMITER ;

-- Trigger to automatically update recipe rating when a new rating is added
DELIMITER $$
CREATE TRIGGER after_rating_change
AFTER INSERT ON user_ratings
FOR EACH ROW
BEGIN
  DECLARE avg_rating DECIMAL(3,2);
  
  SELECT AVG(rating) INTO avg_rating
  FROM user_ratings
  WHERE recipe_id = NEW.recipe_id;
  
  -- This would update a rating field in recipes table if you add one
  -- For now, we're just calculating it on the fly
END$$
DELIMITER ;

-- Trigger to add ingredients to shopping list when a meal is planned
DELIMITER $$
CREATE TRIGGER after_meal_planned
AFTER INSERT ON planned_meals
FOR EACH ROW
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE default_list_id INT;
  DECLARE ing_id INT;
  DECLARE ing_name VARCHAR(100);
  DECLARE ing_quantity DECIMAL(10,2);
  DECLARE ing_unit VARCHAR(20);
  DECLARE ing_category VARCHAR(50);
  
  -- Get user's default shopping list
  SELECT list_id INTO default_list_id
  FROM shopping_lists
  WHERE user_id = (SELECT user_id FROM meal_plans WHERE plan_id = NEW.plan_id)
  ORDER BY created_at ASC
  LIMIT 1;
  
  -- Cursor for ingredients of the recipe
  DECLARE ingredient_cursor CURSOR FOR
    SELECT ri.ingredient_id, i.name, ri.quantity * NEW.servings, ri.unit, ic.name
    FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
    JOIN ingredient_categories ic ON i.category_id = ic.category_id
    WHERE ri.recipe_id = NEW.recipe_id;
  
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
  OPEN ingredient_cursor;
  
  read_loop: LOOP
    FETCH ingredient_cursor INTO ing_id, ing_name, ing_quantity, ing_unit, ing_category;
    
    IF done THEN
      LEAVE read_loop;
    END IF;
    
    -- Check if ingredient already exists in shopping list and not checked
    IF EXISTS (
      SELECT 1 FROM shopping_list_items 
      WHERE list_id = default_list_id AND ingredient_id = ing_id AND checked = FALSE
    ) THEN
      -- Update quantity if it exists
      UPDATE shopping_list_items
      SET quantity = quantity + ing_quantity
      WHERE list_id = default_list_id AND ingredient_id = ing_id AND checked = FALSE;
    ELSE
      -- Add new item if it doesn't exist
      INSERT INTO shopping_list_items (list_id, ingredient_id, name, quantity, unit, category)
      VALUES (default_list_id, ing_id, ing_name, ing_quantity, ing_unit, ing_category);
    END IF;
  END LOOP;
  
  CLOSE ingredient_cursor;
END$$
DELIMITER ;

-- -----------------------------------------------------
-- Initial Data
-- -----------------------------------------------------

-- Inserting meal types
INSERT INTO meal_types (name) VALUES 
  ('Breakfast'),
  ('Lunch'),
  ('Dinner'),
  ('Snack');

-- Inserting recipe categories
INSERT INTO recipe_categories (name, description) VALUES 
  ('Main Course', 'Primary dishes for lunch or dinner'),
  ('Breakfast', 'Morning meals to start the day'),
  ('Salad', 'Fresh and healthy salads'),
  ('Soup', 'Warm and comforting soups'),
  ('Dessert', 'Sweet treats and desserts'),
  ('Beverage', 'Drinks and cocktails'),
  ('Appetizer', 'Starters and small bites'),
  ('Side Dish', 'Accompaniments to main courses');

-- Inserting ingredient categories
INSERT INTO ingredient_categories (name) VALUES
  ('Produce'),
  ('Meat'),
  ('Seafood'),
  ('Dairy'),
  ('Bakery'),
  ('Dry Goods'),
  ('Canned Goods'),
  ('Frozen'),
  ('Oils & Vinegars'),
  ('Spices & Seasonings');

-- Create views for easier querying

-- View for recipe details with category name
CREATE VIEW recipe_details AS
SELECT r.*, rc.name as category_name
FROM recipes r
JOIN recipe_categories rc ON r.category_id = rc.category_id;

-- View for shopping list items with category
CREATE VIEW shopping_list_details AS
SELECT sli.*, sl.user_id, sl.name as list_name
FROM shopping_list_items sli
JOIN shopping_lists sl ON sli.list_id = sl.list_id;

-- View for meal plan details
CREATE VIEW meal_plan_details AS
SELECT pm.*, mp.user_id, mp.name as plan_name, 
       r.title as recipe_name, mt.name as meal_type
FROM planned_meals pm
JOIN meal_plans mp ON pm.plan_id = mp.plan_id
JOIN recipes r ON pm.recipe_id = r.recipe_id
JOIN meal_types mt ON pm.meal_type_id = mt.type_id;
