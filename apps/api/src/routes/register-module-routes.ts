import type { Express } from "express";
import { createAuthController } from "../modules/auth/controller";
import { createRequireAuth } from "../modules/auth/middleware";
import { createAuthRateLimit } from "../modules/auth/rate-limit";
import { createAuthRoutes } from "../modules/auth/routes";
import { createAuthService } from "../modules/auth/service";
import { createSupabaseAuthGateway } from "../modules/auth/supabase";
import { createFeedController } from "../modules/feed/controller";
import { createFeedRepository } from "../modules/feed/repository";
import { createFeedRoutes } from "../modules/feed/routes";
import { createFeedService } from "../modules/feed/service";
import { createHealthController } from "../modules/health/controller";
import { createHealthRoutes } from "../modules/health/routes";
import { createHealthRepository } from "../modules/health/repository";
import { createHealthService } from "../modules/health/service";
import { createMessagesController } from "../modules/messages/controller";
import { createMessagesRepository } from "../modules/messages/repository";
import { createMessagesRoutes } from "../modules/messages/routes";
import { createMessagesService } from "../modules/messages/service";
import { createProfilesController } from "../modules/profiles/controller";
import { createProfilesRepository } from "../modules/profiles/repository";
import { createProfilesRoutes } from "../modules/profiles/routes";
import { createProfilesService } from "../modules/profiles/service";
import { createPostsController } from "../modules/posts/controller";
import { createPostsRepository } from "../modules/posts/repository";
import { createPostsRoutes } from "../modules/posts/routes";
import { createPostsService } from "../modules/posts/service";
import { createViewerController } from "../modules/viewer/controller";
import { createViewerRepository } from "../modules/viewer/repository";
import { createViewerRoutes } from "../modules/viewer/routes";
import { createViewerService } from "../modules/viewer/service";

export function registerModuleRoutes(app: Express) {
  const authGateway = createSupabaseAuthGateway();
  const authService = createAuthService(authGateway);
  const authController = createAuthController(authService);
  const authRateLimit = createAuthRateLimit();
  const requireAuth = createRequireAuth(authService);

  const healthRepository = createHealthRepository();
  const healthService = createHealthService(healthRepository);
  const healthController = createHealthController(healthService);

  const messagesRepository = createMessagesRepository();
  const messagesService = createMessagesService(messagesRepository);
  const messagesController = createMessagesController(messagesService);

  const feedRepository = createFeedRepository();
  const feedService = createFeedService(feedRepository);
  const feedController = createFeedController(feedService);

  const profilesRepository = createProfilesRepository();
  const profilesService = createProfilesService(profilesRepository);
  const profilesController = createProfilesController(profilesService);

  const postsRepository = createPostsRepository();
  const postsService = createPostsService(postsRepository);
  const postsController = createPostsController(postsService);

  const viewerRepository = createViewerRepository();
  const viewerService = createViewerService(viewerRepository);
  const viewerController = createViewerController(viewerService);

  app.use(createHealthRoutes(healthController));
  app.use(createAuthRoutes(authController, authRateLimit, requireAuth));
  app.use(createMessagesRoutes(messagesController, requireAuth));
  app.use(createFeedRoutes(feedController, requireAuth));
  app.use(createProfilesRoutes(profilesController, requireAuth));
  app.use(createPostsRoutes(postsController, requireAuth));
  app.use(createViewerRoutes(viewerController, requireAuth));
}