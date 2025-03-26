CREATE TABLE "blog_categories" (
	"blog_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "blog_categories_blog_id_category_id_pk" PRIMARY KEY("blog_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "expert_categories" ALTER COLUMN "expert_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "expert_categories" ALTER COLUMN "category_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "expert_categories" ADD CONSTRAINT "expert_categories_expert_id_category_id_pk" PRIMARY KEY("expert_id","category_id");--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "appointment_id" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payos_order_id" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payos_payment_id" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payos_checkout_url" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payos_signature" text;--> statement-breakpoint
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_blog_id_blog_posts_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;