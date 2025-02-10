# Black Pear Take Home - FHIR Patient Management API

## Approach

- Spin up a simple node API on main branch following a basic 3 tier architecture for clear separation of concerns. Simulate feature Pull request with the acceptance criteria, discussion points etc on a new branch. Due to personal time constraints I focused on funtionality over a full TDD approach with 100% coverage, which is how I would tackle this in a work environment. A basic jest test for Observation service has been written as an example of how tests could be added. 

## Architecture Overview: Layered Architecture and Versioned API URLs

### Why Versioned API URL instead of header versioning?

App is a small test API. In my opinion this simple approach works best for this case, but in a production app could lead to cluttered URLs, and would require work from clients to switch to new URLs should a new version be released.

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
  };
}
```

5. **Add Routes**

```typescript
// src/routes/example.routes.ts
const router = express.Router();
const repository = new ExampleRepository();
const service = new ExampleService(repository);
const controller = new ExampleController(service);

router.get('/v1/examples', controller.getExamples);
export default router;
```

6. **Update Server Configuration**

```typescript
// src/server.ts
import exampleRoutes from './routes/example.routes';
app.use('/api', exampleRoutes);
```

### Contribution Guidelines

1. Follow Existing Patterns and standards, such as FHIR.

2. Write unit tests using Jest, ensure core functionality coverage

3. Document new functions or endpoints

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
- Evaluate performance bottlenecks via load testing against expected traffic patterns
- Plan for potential architectural evolution
