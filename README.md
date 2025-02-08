# FHIR Patient Management API

## Architecture Overview: Modified MVC with Dependency Injection

### Why This Architecture?

For a small Proof of Concept (POC) application, this architectural approach offers:

#### 1. Simplicity and Quick Development
- Straightforward layer separation
- Minimal boilerplate code
- Easy to understand and implement
- Rapid prototyping capabilities

#### 2. Dependency Injection Benefits
- Loose coupling between components
- Easy unit testing
- Flexible component replacement
- Clear separation of concerns

#### 3. Scalability Considerations
- Provides a solid foundation for future growth
- Allows incremental complexity addition
- Supports potential future refactoring to more complex architectures

### Project Structure
```
src/
├── controllers/     # Request handling & response formatting
├── services/        # Business logic coordination
├── repositories/    # Data access and persistence
├── models/          # Data structures and type definitions
└── utils/           # Shared utilities and helpers
```

### Layer Responsibilities

1. **Controllers**
   - Handle HTTP request/response
   - Validate input parameters
   - Coordinate service calls
   - Format FHIR-compliant responses

2. **Services**
   - Implement business logic
   - Coordinate between controllers and repositories
   - Apply domain-specific rules
   - Manage transactions

3. **Repositories**
   - Handle data persistence
   - Implement data retrieval logic
   - Abstract data source interactions

4. **Models**
   - Define data structures
   - Represent domain entities
   - Ensure type safety

## Contributing to the Project

### Adding a New Endpoint

#### Step-by-Step Guide

1. **Create Model**
```typescript
// src/models/example.model.ts
export interface Example {
  id: string;
  name: string;
  // Add other properties
}
```

2. **Create Repository**
```typescript
// src/repositories/example.repository.ts
export class ExampleRepository {
  async searchExamples(params: FHIRSearchParams): Promise<Example[]> {
    // Implement data retrieval logic
  }
}
```

3. **Create Service**
```typescript
// src/services/example.service.ts
export class ExampleService {
  constructor(private repository: ExampleRepository) {}

  async findExamples(searchParams: FHIRSearchParams): Promise<Example[]> {
    // Implement business logic
    return this.repository.searchExamples(searchParams);
  }
}
```

4. **Create Controller**
```typescript
// src/controllers/example.controller.ts
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  getExamples = async (req: Request, res: Response) => {
    try {
      const examples = await this.exampleService.findExamples(req.query);
      res.json(createFHIRBundle(examples));
    } catch (error) {
      handleFHIRError(res, error);
    }
  }
}
```

5. **Add Routes**
```typescript
// src/routes/example.routes.ts
const router = express.Router();
const repository = new ExampleRepository();
const service = new ExampleService(repository);
const controller = new ExampleController(service);

router.get("/v1/examples", controller.getExamples);
export default router;
```

6. **Update Server Configuration**
```typescript
// src/server.ts
import exampleRoutes from './routes/example.routes';
app.use('/api', exampleRoutes);
```

### Contribution Guidelines

1. Follow Existing Patterns
   - Maintain consistent code style
   - Use dependency injection
   - Implement FHIR-compliant responses

2. Testing
   - Write unit tests for new components
   - Ensure 100% test coverage
   - Use Jest testing framework

3. Documentation
   - Update README with new endpoint details
   - Add inline code comments
   - Explain complex logic

4. Code Review Process
   - Create pull requests
   - Ensure CI/CD pipeline passes
   - Get approval from maintainers

## Development Setup

### Prerequisites
- Node.js (v14+)
- TypeScript
- npm

### Installation
```bash
git clone <repository-url>
npm install
npm run build
npm start
```

### Running Tests
```bash
npm test
```

## Performance and Scalability

While this architecture is suitable for POC:
- Consider microservices for complex, high-load scenarios
- Evaluate performance bottlenecks
- Plan for potential architectural evolution

